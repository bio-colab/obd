import { create } from 'zustand';
import { ELM327 } from '../lib/obd/elm327';
import { PIDS } from '../lib/obd/pids';
import { db } from '../lib/db';
import { parseDTCResponse } from '../lib/obd/dtc';
import { analyzeDTCsAndData } from '../lib/obd/correlationEngine';

interface TerminalLog {
  timestamp: number;
  type: 'send' | 'receive' | 'info' | 'error';
  message: string;
}

export interface AIDiagnosis {
  rootCauses: string[];
  symptoms: string[];
  explanation: string;
  recommendedActions: string[];
}

interface CarState {
  // Core Data
  liveData: Record<string, number>;
  dtcs: string[];
  vin: string | null;
  readiness: Record<string, boolean> | null;
  
  // Connection & State
  isConnected: boolean;
  connectionType: 'usb' | 'ble' | 'wifi' | null;
  elm: ELM327 | null;
  sessionId: number | null;
  driverScore: number;
  terminalLogs: TerminalLog[];
  
  // AI Diagnostics
  aiDiagnosis: AIDiagnosis | null;
  isAnalyzing: boolean;
  
  // Actions
  connect: (elm: ELM327, type: 'usb' | 'ble' | 'wifi') => Promise<void>;
  disconnect: () => void;
  startPolling: () => void;
  stopPolling: () => void;
  readDTCs: () => Promise<void>;
  clearDTCs: () => Promise<void>;
  readVIN: () => Promise<void>;
  readReadiness: () => Promise<void>;
  sendRawCommand: (cmd: string) => Promise<string>;
  addTerminalLog: (log: Omit<TerminalLog, 'timestamp'>) => void;
  analyzeFaults: () => Promise<void>;
}

let pollingInterval: any = null;
let lastSpeed = 0;
let lastTime = 0;

export const useCarStore = create<CarState>((set, get) => ({
  liveData: {},
  dtcs: [],
  vin: null,
  readiness: null,
  isConnected: false,
  connectionType: null,
  elm: null,
  sessionId: null,
  driverScore: 100,
  terminalLogs: [],
  aiDiagnosis: null,
  isAnalyzing: false,

  analyzeFaults: async () => {
    const { dtcs, liveData } = get();
    if (dtcs.length === 0) return;
    
    set({ isAnalyzing: true, aiDiagnosis: null });
    
    try {
      // 1. Run local correlation engine
      const engineAnalysis = analyzeDTCsAndData(dtcs, liveData);
      
      // 2. Send to AI for deep analysis
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dtcs, liveData, engineAnalysis })
      });
      
      const data = await res.json();
      if (data.success) {
        set({ aiDiagnosis: data.analysis });
      } else {
        console.error('AI Error:', data.error);
      }
    } catch (e) {
      console.error('Failed to analyze faults', e);
    } finally {
      set({ isAnalyzing: false });
    }
  },

  addTerminalLog: (log) => {
    set((state) => ({
      terminalLogs: [...state.terminalLogs, { ...log, timestamp: Date.now() }]
    }));
  },

  sendRawCommand: async (cmd: string) => {
    const { elm, addTerminalLog } = get();
    if (!elm) throw new Error('غير متصل');
    
    addTerminalLog({ type: 'send', message: cmd });
    try {
      const response = await elm.send(cmd);
      addTerminalLog({ type: 'receive', message: response });
      return response;
    } catch (err: any) {
      addTerminalLog({ type: 'error', message: err.message });
      throw err;
    }
  },

  connect: async (elm, type) => {
    try {
      get().addTerminalLog({ type: 'info', message: `جاري الاتصال عبر ${type}...` });
      await elm.init();
      get().addTerminalLog({ type: 'info', message: 'تم الاتصال بنجاح. جاري قراءة معلومات المركبة...' });
      
      const sessionId = await db.sessions.add({ startTime: Date.now() });
      set({ elm, isConnected: true, connectionType: type, sessionId });
      
      // Initial reads
      await get().readVIN();
      await get().readReadiness();
      
      get().startPolling();
    } catch (err: any) {
      get().addTerminalLog({ type: 'error', message: `فشل الاتصال: ${err.message}` });
      console.error('Connection failed', err);
      throw err;
    }
  },

  disconnect: () => {
    const { elm, sessionId } = get();
    if (elm) elm.disconnect();
    get().stopPolling();
    if (sessionId) {
      db.sessions.update(sessionId, { endTime: Date.now() });
    }
    set({ elm: null, isConnected: false, connectionType: null, sessionId: null, liveData: {} });
    get().addTerminalLog({ type: 'info', message: 'تم قطع الاتصال.' });
  },

  readVIN: async () => {
    const { elm } = get();
    if (!elm) return;
    try {
      const raw = await elm.send('0902');
      const vin = elm.parseVIN(raw);
      if (vin) set({ vin });
    } catch (e) {
      console.error('Failed to read VIN', e);
    }
  },

  readReadiness: async () => {
    const { elm } = get();
    if (!elm) return;
    try {
      const raw = await elm.send('0101');
      const readiness = elm.parseReadiness(raw);
      if (readiness) set({ readiness });
    } catch (e) {
      console.error('Failed to read Readiness', e);
    }
  },

  startPolling: () => {
    if (pollingInterval) clearInterval(pollingInterval);
    
    // Poll all defined PIDs
    const pidsToPoll = Object.keys(PIDS);
    
    pollingInterval = setInterval(async () => {
      const { elm, sessionId, driverScore, liveData } = get();
      if (!elm || !elm.connection.isConnected) return;

      const newLiveData = { ...liveData };
      const now = Date.now();

      for (const key of pidsToPoll) {
        try {
          const pid = PIDS[key];
          const raw = await elm.send(pid.code);
          const bytes = elm.parsePIDResponse(raw, pid.code);
          if (bytes) {
            newLiveData[key] = pid.calc(bytes);
          }
        } catch (e) {
          // ignore timeout/error for single PID
        }
      }

      set({ liveData: newLiveData });

      // Feature F: Send to IoT Backend
      fetch('/api/car/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLiveData)
      }).catch(() => {});

      // Feature C: Log to Dexie
      if (sessionId) {
        db.readings.add({
          sessionId,
          timestamp: now,
          speed: newLiveData.SPEED || 0,
          rpm: newLiveData.RPM || 0,
          temp: newLiveData.TEMP || 0,
          throttle: newLiveData.THROTTLE || 0,
          voltage: newLiveData.BATTERY || 0
        });
      }

      // Feature G: Driver Behavior Analysis
      if (newLiveData.SPEED !== undefined) {
        if (lastTime > 0) {
          const deltaV = newLiveData.SPEED - lastSpeed;
          const deltaT = (now - lastTime) / 1000;
          const accel = deltaV / deltaT;

          if (accel > 6.67) { // Hard acceleration
            set({ driverScore: Math.max(0, driverScore - 2) });
            db.events.add({ sessionId: sessionId!, timestamp: now, type: 'hard_accel', value: accel });
          } else if (accel < -6.67) { // Hard braking
            set({ driverScore: Math.max(0, driverScore - 2) });
            db.events.add({ sessionId: sessionId!, timestamp: now, type: 'hard_brake', value: accel });
          }
        }
        lastSpeed = newLiveData.SPEED;
        lastTime = now;
      }

      // Feature E: Smart Alerts
      if (newLiveData.TEMP && newLiveData.TEMP > 105) {
        new Notification('تنبيه: حرارة المحرك مرتفعة!', { body: `${newLiveData.TEMP}°C` });
      }
      if (newLiveData.BATTERY && newLiveData.BATTERY < 11.5) {
        new Notification('تنبيه: جهد البطارية منخفض!', { body: `${newLiveData.BATTERY}V` });
      }

    }, 1500); // Poll every 1.5 seconds to avoid overwhelming ELM327 with 20+ PIDs
  },

  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  readDTCs: async () => {
    const { elm } = get();
    if (!elm) return;
    try {
      const raw = await elm.send('03');
      const dtcs = parseDTCResponse(raw);
      set({ dtcs });
    } catch (e) {
      console.error('Failed to read DTCs', e);
    }
  },

  clearDTCs: async () => {
    const { elm } = get();
    if (!elm) return;
    try {
      await elm.send('04');
      set({ dtcs: [] });
    } catch (e) {
      console.error('Failed to clear DTCs', e);
    }
  }
}));
