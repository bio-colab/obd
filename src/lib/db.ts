import Dexie, { Table } from 'dexie';

export interface CarReading {
  id?: number;
  sessionId: number;
  timestamp: number;
  speed: number;
  rpm: number;
  temp: number;
  throttle: number;
  voltage: number;
}

export interface DrivingSession {
  id?: number;
  startTime: number;
  endTime?: number;
}

export interface DriverEvent {
  id?: number;
  sessionId: number;
  timestamp: number;
  type: 'hard_accel' | 'hard_brake' | 'speeding';
  value: number;
}

export class OBDDatabase extends Dexie {
  sessions!: Table<DrivingSession, number>;
  readings!: Table<CarReading, number>;
  events!: Table<DriverEvent, number>;

  constructor() {
    super('OBDLogger');
    this.version(1).stores({
      sessions: '++id, startTime, endTime',
      readings: '++id, sessionId, timestamp, speed, rpm, temp',
      events: '++id, sessionId, timestamp, type'
    });
  }
}

export const db = new OBDDatabase();
