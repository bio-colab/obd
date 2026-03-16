import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

// Define strict types for CarState
interface CarState {
  speed: number;
  rpm: number;
  temp: number;
  voltage: number;
  throttle: number;
  map: number;
  maf: number;
  fuel_level: number;
  dtcs: string[];
  lastUpdated: number | null;
}

// In-memory store for car data
let carState: CarState = {
  speed: 0,
  rpm: 0,
  temp: 0,
  voltage: 0,
  throttle: 0,
  map: 0,
  maf: 0,
  fuel_level: 0,
  dtcs: [],
  lastUpdated: null,
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 300; // 300 requests per minute (allows frontend polling + extra)

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  }
  
  record.count++;
  rateLimitMap.set(ip, record);
  
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({ error: "Too many requests, please try again later." });
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '100kb' })); // Limit payload size

  // Apply rate limiter to all API routes
  app.use("/api", rateLimiter);

  // --- REST API (Feature H & F) ---

  // Frontend pushes data here (Feature F - IoT Platform)
  app.post("/api/car/update", (req, res) => {
    // Basic validation
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Only allow specific numeric fields to be updated
    const allowedFields = ['speed', 'rpm', 'temp', 'voltage', 'throttle', 'map', 'maf', 'fuel_level'];
    const updates: Partial<CarState> = {};
    
    for (const field of allowedFields) {
      if (field in req.body && typeof req.body[field] === 'number') {
        (updates as any)[field] = req.body[field];
      }
    }

    if (Array.isArray(req.body.dtcs)) {
      updates.dtcs = req.body.dtcs.filter((d: any) => typeof d === 'string');
    }

    carState = { ...carState, ...updates, lastUpdated: Date.now() };
    res.json({ success: true });
  });

  // External apps can read data here (Feature H - Car API)
  app.get("/api/car/snapshot", (req, res) => {
    res.json({ success: true, timestamp: Date.now(), data: carState });
  });

  app.get("/api/car/rpm", (req, res) => {
    res.json({ rpm: carState.rpm || 0 });
  });

  app.get("/api/car/speed", (req, res) => {
    res.json({ speed: carState.speed || 0 });
  });

  app.get("/api/car/temperature", (req, res) => {
    res.json({ temperature: carState.temp || 0 });
  });

  // --- AI Diagnostics Endpoint ---
  app.post("/api/ai/diagnose", async (req, res) => {
    try {
      const { dtcs, liveData, engineAnalysis } = req.body;
      
      if (!dtcs || !Array.isArray(dtcs)) {
        return res.status(400).json({ error: "Invalid DTCs payload" });
      }
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
      قم بتحليل أعطال السيارة التالية والبيانات الحية لتحديد السبب الجذري (Root Cause) والأعراض الجانبية (Symptoms).
      
      الأعطال المسجلة (DTCs):
      ${dtcs.join(', ')}
      
      البيانات الحية للحساسات (Live Data):
      ${JSON.stringify(liveData, null, 2)}
      
      تحليل المحرك المبدئي (Correlation Engine Analysis):
      ${JSON.stringify(engineAnalysis, null, 2)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "أنت خبير ميكانيكي سيارات معتمد (ASE Master Mechanic). مهمتك هي تحليل رموز أعطال OBD2 والبيانات الحية. يجب عليك التمييز بين الأسباب الجذرية (مثل: تلف حساس MAF، تسريب هواء) والأعراض الجانبية (مثل: ضعف الاحتراق، ضعف دبة التلوث). يجب أن يكون الرد بصيغة JSON مهيكلة باللغة العربية.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rootCauses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "الأسباب الجذرية المحتملة التي أدت لظهور باقي الأعطال." },
              symptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "الأعطال التي تعتبر مجرد أعراض جانبية للسبب الجذري." },
              explanation: { type: Type.STRING, description: "شرح مفصل لكيفية ارتباط الأعطال ببعضها وكيف أدى السبب الجذري لظهور الأعراض." },
              recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "خطوات الفحص والإصلاح الموصى بها بالترتيب." }
            },
            required: ["rootCauses", "symptoms", "explanation", "recommendedActions"]
          }
        }
      });

      res.json({ success: true, analysis: JSON.parse(response.text || "{}") });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
