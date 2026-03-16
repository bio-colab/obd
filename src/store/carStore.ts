import { create } from 'zustand';
import { CarState } from './slices/types';
import { createConnectionSlice } from './slices/connectionSlice';
import { createPollingSlice } from './slices/pollingSlice';
import { createDiagnosticSlice } from './slices/diagnosticSlice';
import { createSettingsSlice } from './slices/settingsSlice';

export const useCarStore = create<CarState>()((...a) => ({
  ...createConnectionSlice(...a),
  ...createPollingSlice(...a),
  ...createDiagnosticSlice(...a),
  ...createSettingsSlice(...a),
}));

export type { CarState, AIDiagnosis, TerminalLog } from './slices/types';
