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
    // Some ELM327 devices take time to reset and send the prompt
    await new Promise(r => setTimeout(r, 1000)); 
    
    // Clear any residual data in the buffer after reset
    try {
      // Send a dummy command to get a prompt or just read if there's anything left
      await this.connection.send('\r');
      await this.connection.read();
    } catch (e) {
      // Ignore timeout if buffer was already empty
    }

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
      
      // Add a timeout to the read operation (5000ms for slower connections)
      const readPromise = this.connection.read();
      const timeoutPromise = new Promise<string>((_, rej) => 
        setTimeout(() => rej(new Error('Timeout waiting for ELM327 response')), 5000)
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

  parsePIDResponse(hexString: string, pidCode: string, expectedBytes?: number): number[] | null {
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

    let dataHex = cleanHex.substring(index + expectedPrefix.length);
    
    // If expectedBytes is provided, strictly slice the string to avoid junk data
    if (expectedBytes) {
      const expectedHexLength = expectedBytes * 2;
      if (dataHex.length >= expectedHexLength) {
        dataHex = dataHex.substring(0, expectedHexLength);
      } else {
        // Not enough data
        return null;
      }
    }

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

    // Ensure we have enough bytes (41 01 A B C D)
    if (cleanHex.length < index + 12) return null;

    const b = parseInt(cleanHex.substring(index + 6, index + 8), 16);
    const c = parseInt(cleanHex.substring(index + 8, index + 10), 16);
    const d = parseInt(cleanHex.substring(index + 10, index + 12), 16);

    // Check if Spark or Compression Ignition
    const isCompression = (b & 0x08) !== 0;

    // Bitwise parsing for common monitors
    // 0 = ready, 1 = not ready
    // However, we must also check if the monitor is supported!
    // If a monitor is not supported, it's technically "ready" (or N/A), but we shouldn't flag it as an error.
    
    const readiness: Record<string, boolean> = {};

    // Continuous monitors (always supported)
    readiness.misfire = (b & 0x10) === 0;
    readiness.fuelSystem = (b & 0x20) === 0;
    readiness.components = (b & 0x40) === 0;

    if (!isCompression) {
      // Spark Ignition
      readiness.catalyst = (c & 0x01) === 0 ? true : (d & 0x01) === 0;
      readiness.heatedCatalyst = (c & 0x02) === 0 ? true : (d & 0x02) === 0;
      readiness.evap = (c & 0x04) === 0 ? true : (d & 0x04) === 0;
      readiness.secondaryAir = (c & 0x08) === 0 ? true : (d & 0x08) === 0;
      readiness.acRefrigerant = (c & 0x10) === 0 ? true : (d & 0x10) === 0;
      readiness.o2Sensor = (c & 0x20) === 0 ? true : (d & 0x20) === 0;
      readiness.o2Heater = (c & 0x40) === 0 ? true : (d & 0x40) === 0;
      readiness.egr = (c & 0x80) === 0 ? true : (d & 0x80) === 0;
    } else {
      // Compression Ignition (Diesel)
      readiness.nmhc = (c & 0x01) === 0 ? true : (d & 0x01) === 0;
      readiness.nox = (c & 0x02) === 0 ? true : (d & 0x02) === 0;
      readiness.boostPressure = (c & 0x08) === 0 ? true : (d & 0x08) === 0;
      readiness.egr = (c & 0x20) === 0 ? true : (d & 0x20) === 0;
      readiness.pmFilter = (c & 0x80) === 0 ? true : (d & 0x80) === 0;
    }

    return readiness;
  }

  disconnect() {
    this.connection.disconnect();
  }
}
