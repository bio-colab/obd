import { ConnectionManager } from './ConnectionManager';

export class ELM327 {
  public connection: ConnectionManager;
  private isProcessing: boolean = false;
  private queue: { cmd: string; resolve: (val: string) => void; reject: (err: Error) => void }[] = [];

  constructor(connection: ConnectionManager) {
    this.connection = connection;
  }

  async init(): Promise<void> {
    await this.connection.connect();
    
    // AT Commands sequence
    await this.send('ATZ'); // Reset
    await new Promise(r => setTimeout(r, 1000)); // Wait for reset
    await this.send('ATE0'); // Echo off
    await this.send('ATL0'); // Linefeed off
    await this.send('ATS0'); // Spaces off
    await this.send('ATH0'); // Headers off
    await this.send('ATSP0'); // Auto protocol
    await this.send('0100'); // Test OBD connection
  }

  async send(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ cmd, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    const { cmd, resolve, reject } = this.queue.shift()!;

    try {
      await this.connection.send(cmd);
      
      // Add a timeout to the read operation (e.g., 2000ms)
      const readPromise = this.connection.read();
      const timeoutPromise = new Promise<string>((_, rej) => 
        setTimeout(() => rej(new Error('Timeout waiting for ELM327 response')), 2000)
      );
      
      const response = await Promise.race([readPromise, timeoutPromise]);
      resolve(response);
    } catch (err) {
      reject(err as Error);
    } finally {
      this.isProcessing = false;
      this.processQueue();
    }
  }

  parsePIDResponse(hexString: string, pidCode: string): number[] | null {
    // Clean string
    const cleanHex = hexString.replace(/\s/g, '').toUpperCase();
    
    // Check if NO DATA
    if (cleanHex.includes('NODATA') || cleanHex.includes('ERROR')) {
      return null;
    }

    // Expected response code (e.g. 010C -> 410C)
    const expectedPrefix = '41' + pidCode.substring(2);
    
    const index = cleanHex.indexOf(expectedPrefix);
    if (index === -1) return null;

    const dataHex = cleanHex.substring(index + expectedPrefix.length);
    const bytes = [];
    for (let i = 0; i < dataHex.length; i += 2) {
      bytes.push(parseInt(dataHex.substring(i, i + 2), 16));
    }
    
    return bytes;
  }

  parseVIN(hexString: string): string | null {
    const cleanHex = hexString.replace(/\s/g, '').toUpperCase();
    if (cleanHex.includes('NODATA') || cleanHex.includes('ERROR')) return null;

    // Mode 09 PID 02 response starts with 4902
    const index = cleanHex.indexOf('4902');
    if (index === -1) return null;

    // Skip 49 02 01 (01 is the message count)
    const dataHex = cleanHex.substring(index + 6);
    let vin = '';
    for (let i = 0; i < dataHex.length; i += 2) {
      const charCode = parseInt(dataHex.substring(i, i + 2), 16);
      if (charCode >= 32 && charCode <= 126) {
        vin += String.fromCharCode(charCode);
      }
    }
    return vin.length >= 17 ? vin.substring(0, 17) : vin;
  }

  parseReadiness(hexString: string): Record<string, boolean> | null {
    const cleanHex = hexString.replace(/\s/g, '').toUpperCase();
    if (cleanHex.includes('NODATA') || cleanHex.includes('ERROR')) return null;

    const index = cleanHex.indexOf('4101');
    if (index === -1) return null;

    const b = parseInt(cleanHex.substring(index + 6, index + 8), 16);
    const c = parseInt(cleanHex.substring(index + 8, index + 10), 16);
    const d = parseInt(cleanHex.substring(index + 10, index + 12), 16);

    // Bitwise parsing for common monitors (0 = ready, 1 = not ready)
    return {
      misfire: (b & 0x01) === 0,
      fuelSystem: (b & 0x02) === 0,
      components: (b & 0x04) === 0,
      catalyst: (c & 0x01) === 0,
      heatedCatalyst: (c & 0x02) === 0,
      evap: (c & 0x04) === 0,
      secondaryAir: (c & 0x08) === 0,
      acRefrigerant: (c & 0x10) === 0,
      o2Sensor: (c & 0x20) === 0,
      o2Heater: (c & 0x40) === 0,
      egr: (c & 0x80) === 0,
    };
  }

  disconnect() {
    this.connection.disconnect();
  }
}
