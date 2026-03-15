import { ConnectionManager } from './ConnectionManager';

export class USBConnection extends ConnectionManager {
  private port: any = null;
  private reader: any = null;
  private writer: any = null;

  constructor() {
    super('usb');
  }

  async connect(): Promise<void> {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API غير مدعوم في هذا المتصفح');
    }
    
    // @ts-ignore
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 38400 });
    
    // @ts-ignore
    const textDecoder = new TextDecoderStream();
    this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable.getReader();

    // @ts-ignore
    const textEncoder = new TextEncoderStream();
    textEncoder.readable.pipeTo(this.port.writable);
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
      const { value, done } = await this.reader.read();
      if (done) break;
      response += value;
      if (response.includes('>')) {
        break;
      }
    }
    return response.replace('>', '').trim();
  }

  disconnect(): void {
    if (this.reader) {
      this.reader.cancel();
      this.reader.releaseLock();
    }
    if (this.writer) {
      this.writer.close();
      this.writer.releaseLock();
    }
    if (this.port) {
      this.port.close();
    }
    this._connected = false;
  }
}
