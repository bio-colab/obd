import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

// In-memory store for car data (Feature F & H)
let carState: Record<string, any> = {
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- REST API (Feature H & F) ---

  // Frontend pushes data here (Feature F - IoT Platform)
  app.post("/api/car/update", (req, res) => {
    carState = { ...carState, ...req.body, lastUpdated: Date.now() };
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
