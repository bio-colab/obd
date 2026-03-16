import { StateCreator } from 'zustand';
import { CarState, DiagnosticSlice } from './types';
import { parseDTCResponse } from '../../lib/obd/dtc';
import { analyzeDTCsAndData } from '../../lib/obd/correlationEngine';
import { useI18n } from '../../lib/i18n';

export const createDiagnosticSlice: StateCreator<CarState, [], [], DiagnosticSlice> = (set, get) => ({
  dtcs: [],
  vin: null,
  readiness: null,
  aiDiagnosis: null,
  isAnalyzing: false,

  analyzeFaults: async () => {
    const { dtcs, liveData } = get();
    if (dtcs.length === 0) return;
    
    set({ isAnalyzing: true, aiDiagnosis: null });
    
    try {
      const engineAnalysis = analyzeDTCsAndData(dtcs, liveData);
      const { uiLang, termLang } = useI18n.getState();

      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dtcs, liveData, engineAnalysis, uiLang, termLang })
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
  },

  readVIN: async () => {
    const { elm } = get();
    if (!elm) return false;
    try {
      const raw = await elm.send('0902');
      const vin = elm.parseVIN(raw);
      if (vin) {
        set({ vin });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to read VIN', e);
      return false;
    }
  },

  readReadiness: async () => {
    const { elm } = get();
    if (!elm) return false;
    try {
      const raw = await elm.send('0101');
      const readiness = elm.parseReadiness(raw);
      if (readiness) {
        set({ readiness });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to read Readiness', e);
      return false;
    }
  },
});
