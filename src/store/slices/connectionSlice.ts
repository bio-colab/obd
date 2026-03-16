import { StateCreator } from 'zustand';
import { CarState, ConnectionSlice } from './types';
import { db } from '../../lib/db';

export const createConnectionSlice: StateCreator<CarState, [], [], ConnectionSlice> = (set, get) => ({
  isConnected: false,
  connectionType: null,
  elm: null,
  sessionId: null,
  terminalLogs: [],

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
});
