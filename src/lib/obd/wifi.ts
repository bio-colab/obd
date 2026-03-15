import { ConnectionManager } from './ConnectionManager';

export class WiFiConnection extends ConnectionManager {
  private socket: WebSocket | null = null;
  private responseBuffer: string = '';
  private resolveRead: ((value: string) => void) | null = null;

  constructor(private url: string = 'ws://192.168.0.10:35000') {
    super('wifi');
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          this._connected = true;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.responseBuffer += event.data;
          if (this.responseBuffer.includes('>')) {
            if (this.resolveRead) {
              this.resolveRead(this.responseBuffer.replace('>', '').trim());
              this.resolveRead = null;
            }
            this.responseBuffer = '';
          }
        };

        this.socket.onerror = (error) => {
          reject(new Error('فشل الاتصال عبر WiFi'));
        };

        this.socket.onclose = () => {
          this._connected = false;
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  async send(cmd: string): Promise<void> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('غير متصل');
    }
    this.socket.send(cmd + '\r');
  }

  async read(): Promise<string> {
    return new Promise((resolve) => {
      this.resolveRead = resolve;
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    this._connected = false;
  }
}
