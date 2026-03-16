import { ConnectionManager } from './ConnectionManager';

export class DemoConnection extends ConnectionManager {
  private interval: any;
  private speed = 0;
  private rpm = 800;
  private temp = 85;
  private voltage = 12.6;
  private responseQueue: string[] = [];

  constructor() {
    super('wifi'); // Use wifi as base type for UI purposes
    this.type = 'wifi';
  }

  async connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._connected = true;
        this.startSimulation();
        resolve();
      }, 500);
    });
  }

  private startSimulation() {
    this.interval = setInterval(() => {
      // Simulate driving
      this.speed = Math.min(120, Math.max(0, this.speed + (Math.random() * 10 - 4)));
      this.rpm = Math.min(6000, Math.max(800, this.rpm + (Math.random() * 500 - 200)));
      this.temp = Math.min(110, Math.max(80, this.temp + (Math.random() * 2 - 1)));
      this.voltage = Math.min(14.4, Math.max(11.0, this.voltage + (Math.random() * 0.2 - 0.1)));
    }, 1000);
  }

  async send(cmd: string): Promise<void> {
    if (!this._connected) throw new Error('Not connected');
    
    // Clean command
    const cleanCmd = cmd.replace(/\s/g, '').toUpperCase().replace('\r', '');
    let response = 'NO DATA>';

    if (cleanCmd.startsWith('AT')) {
      response = 'OK>';
    } else if (cleanCmd === '010D') { // Speed
      const hex = Math.round(this.speed).toString(16).padStart(2, '0').toUpperCase();
      response = `41 0D ${hex}>`;
    } else if (cleanCmd === '010C') { // RPM
      const hex = Math.round(this.rpm * 4).toString(16).padStart(4, '0').toUpperCase();
      response = `41 0C ${hex.substring(0, 2)} ${hex.substring(2, 4)}>`;
    } else if (cleanCmd === '0105') { // Temp
      const hex = Math.round(this.temp + 40).toString(16).padStart(2, '0').toUpperCase();
      response = `41 05 ${hex}>`;
    } else if (cleanCmd === '0142') { // Voltage
      const hex = Math.round(this.voltage * 1000).toString(16).padStart(4, '0').toUpperCase();
      response = `41 42 ${hex.substring(0, 2)} ${hex.substring(2, 4)}>`;
    } else if (cleanCmd === '03') { // Read DTCs
      response = '43 01 33 00 00 00 00>'; // P0133
    } else if (cleanCmd === '04') { // Clear DTCs
      response = '44>';
    } else if (cleanCmd === '0902') { // VIN
      response = '49 02 01 44 45 4D 4F 56 49 4E 31 32 33 34 35 36 37 38 39 30>';
    } else if (cleanCmd === '0101') { // Readiness
      response = '41 01 00 07 65 00>';
    } else {
      // Generic response for other PIDs
      response = `41 ${cleanCmd.substring(2)} 00 00>`;
    }

    this.responseQueue.push(response);
    return Promise.resolve();
  }

  async read(): Promise<string> {
    if (!this._connected) throw new Error('Not connected');
    return new Promise((resolve) => {
      const checkQueue = () => {
        if (this.responseQueue.length > 0) {
          resolve(this.responseQueue.shift()!);
        } else {
          setTimeout(checkQueue, 10);
        }
      };
      checkQueue();
    });
  }

  disconnect(): void {
    this._connected = false;
    if (this.interval) clearInterval(this.interval);
  }
}
