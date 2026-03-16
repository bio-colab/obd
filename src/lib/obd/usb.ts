import { ConnectionManager } from './ConnectionManager';

export class USBConnection extends ConnectionManager {
  private port: any = null;
  private reader: any = null;
  private writer: any = null;
  private abortController: AbortController | null = null;

  constructor() {
    super('usb');
  }

  async connect(): Promise<void> {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API غير مدعوم في هذا المتصفح');
    }
    
    // @ts-ignore
    this.port = await navigator.serial.requestPort();
    
    // Try common baud rates
    const baudRates = [38400, 115200, 9600];
    let opened = false;
    
    for (const baudRate of baudRates) {
      try {
        await this.port.open({ baudRate });
        opened = true;
        break; // Successfully opened
      } catch (e) {
        // If it's already open, or failed, try to close and reopen if possible
        try { await this.port.close(); } catch (_) {}
      }
    }

    if (!opened) {
      throw new Error('فشل فتح المنفذ التسلسلي بأي سرعة نقل (Baud Rate)');
    }
    
    this.abortController = new AbortController();

    // @ts-ignore
    const textDecoder = new TextDecoderStream();
    this.port.readable.pipeTo(textDecoder.writable, { signal: this.abortController.signal }).catch(() => {});
    this.reader = textDecoder.readable.getReader();

    // @ts-ignore
    const textEncoder = new TextEncoderStream();
    textEncoder.readable.pipeTo(this.port.writable, { signal: this.abortController.signal }).catch(() => {});
    this.writer = textEncoder.writable.getWriter();

    this._connected = true;
  }

  async send(cmd: string): Promise<void> {
    if (!this.writer) throw new Error('غير متصل');
    await this.writer.write(cmd + '\r');
  }

  async read(): Promise<string> {
    if (!this.reader) throw new Error('غير متصل');
    let response = '';
    while (true) {
      try {
        const { value, done } = await this.reader.read();
        if (done) break;
        response += value;
        if (response.includes('>')) {
          break;
        }
      } catch (e) {
        break; // Stream closed or errored
      }
    }
    return response.replace('>', '').trim();
  }

  disconnect(): void {
    this._connected = false;
    
    if (this.abortController) {
      this.abortController.abort();
    }
    
    if (this.reader) {
      try { this.reader.cancel(); } catch (e) {}
      try { this.reader.releaseLock(); } catch (e) {}
    }
    if (this.writer) {
      try { this.writer.close(); } catch (e) {}
      try { this.writer.releaseLock(); } catch (e) {}
    }
    if (this.port) {
      try { this.port.close(); } catch (e) {}
    }
  }
}
