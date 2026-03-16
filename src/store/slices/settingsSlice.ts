import { StateCreator } from 'zustand';
import { CarState, SettingsSlice } from './types';

export const createSettingsSlice: StateCreator<CarState, [], [], SettingsSlice> = (set, get) => ({
  smartAlertsEnabled: false,

  toggleSmartAlerts: () => {
    const current = get().smartAlertsEnabled;
    if (!current && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          set({ smartAlertsEnabled: true });
        }
      });
    } else {
      set({ smartAlertsEnabled: !current });
    }
  },
});
