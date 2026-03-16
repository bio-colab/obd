import { ELM327 } from '../../lib/obd/elm327';

export interface TerminalLog {
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

export interface ConnectionSlice {
  isConnected: boolean;
  connectionType: 'usb' | 'ble' | 'wifi' | 'demo' | null;
  elm: ELM327 | null;
  sessionId: number | null;
  terminalLogs: TerminalLog[];
  connect: (elm: ELM327, type: 'usb' | 'ble' | 'wifi' | 'demo') => Promise<void>;
  disconnect: () => void;
  sendRawCommand: (cmd: string) => Promise<string>;
  addTerminalLog: (log: Omit<TerminalLog, 'timestamp'>) => void;
}

export interface PollingSlice {
  liveData: Record<string, number>;
  pollingInterval: any;
  offlineQueue: Record<string, any>[];
  startPolling: () => void;
  stopPolling: () => void;
}

export interface DiagnosticSlice {
  dtcs: string[];
  vin: string | null;
  readiness: Record<string, boolean> | null;
  aiDiagnosis: AIDiagnosis | null;
  isAnalyzing: boolean;
  readDTCs: () => Promise<void>;
  clearDTCs: () => Promise<void>;
  readVIN: () => Promise<boolean>;
  readReadiness: () => Promise<boolean>;
  analyzeFaults: () => Promise<void>;
}

export interface SettingsSlice {
  smartAlertsEnabled: boolean;
  toggleSmartAlerts: () => void;
}

export type CarState = ConnectionSlice & PollingSlice & DiagnosticSlice & SettingsSlice;
