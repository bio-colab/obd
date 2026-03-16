import { StateCreator } from 'zustand';
import { CarState, PollingSlice } from './types';
import { db } from '../../lib/db';
import { PIDS } from '../../lib/obd/pids';

let lastAlerts = { temp: 0, battery: 0 };
const ALERT_COOLDOWN = 5 * 60 * 1000;

export const createPollingSlice: StateCreator<CarState, [], [], PollingSlice> = (set, get) => ({
  liveData: {},
  pollingInterval: null,
  offlineQueue: [],

  startPolling: () => {
    const state = get();
    if (state.pollingInterval) clearTimeout(state.pollingInterval);
    
    const pidsToPoll = Object.keys(PIDS);
    let consecutiveFailures = 0;
    
    const poll = async () => {
      const { elm, sessionId, liveData, offlineQueue, disconnect } = get();
      
      if (!elm || !elm.connection.isConnected) {
        disconnect();
        return;
      }

      const newLiveData = { ...liveData };
      const now = Date.now();
      let hasErrors = false;

      for (const key of pidsToPoll) {
        try {
          const pid = PIDS[key];
          const raw = await elm.send(pid.code);
          const bytes = elm.parsePIDResponse(raw, pid.code, pid.bytes);
          if (bytes) {
            newLiveData[key] = pid.calc(bytes);
            consecutiveFailures = 0; // Reset on success
          }
        } catch (e) {
          hasErrors = true;
        }
      }

      if (hasErrors && Object.keys(newLiveData).length === 0) {
        consecutiveFailures++;
        if (consecutiveFailures > 3) {
          console.warn('Multiple consecutive read failures, disconnecting...');
          disconnect();
          return;
        }
      }

      set({ liveData: newLiveData });

      const payload = { timestamp: now, data: newLiveData };
      const newQueue = [...offlineQueue, payload];
      
      fetch('/api/car/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQueue)
      }).then(res => {
        if (res.ok) set({ offlineQueue: [] });
        else set({ offlineQueue: newQueue.slice(-50) });
      }).catch(() => {
        set({ offlineQueue: newQueue.slice(-50) });
      });

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

      const { smartAlertsEnabled } = get();
      if (smartAlertsEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        if (newLiveData.TEMP && newLiveData.TEMP > 105 && now - lastAlerts.temp > ALERT_COOLDOWN) {
          new Notification('تنبيه: حرارة المحرك مرتفعة!', { body: `${newLiveData.TEMP}°C` });
          lastAlerts.temp = now;
        }
        if (newLiveData.BATTERY && newLiveData.BATTERY < 11.5 && now - lastAlerts.battery > ALERT_COOLDOWN) {
          new Notification('تنبيه: جهد البطارية منخفض!', { body: `${newLiveData.BATTERY}V` });
          lastAlerts.battery = now;
        }
      }

      const nextInterval = setTimeout(poll, 1500);
      set({ pollingInterval: nextInterval });
    };

    const initialInterval = setTimeout(poll, 0);
    set({ pollingInterval: initialInterval });
  },

  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearTimeout(pollingInterval);
      set({ pollingInterval: null });
    }
  },
});
