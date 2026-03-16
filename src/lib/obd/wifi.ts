import { ConnectionManager } from './ConnectionManager';

export class WiFiConnection extends ConnectionManager {
  private socket: WebSocket | null = null;
  private responseBuffer: string = '';
  private readQueue: string[] = [];
  private resolveRead: ((value: string) => void) | null = null;
  private reconnectTimer: any = null;
  private shouldReconnect: boolean = false;

  constructor(private url: string = 'ws://192.168.0.10:35000') {
    super('wifi');
  }

  async connect(): Promise<void> {
    this.shouldReconnect = true;
    return this.establishConnection();
  }

  private async establishConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket) {
          this.socket.close();
        }

        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          this._connected = true;
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
          }
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.responseBuffer += event.data;
          if (this.responseBuffer.includes('>')) {
            const completeResponse = this.responseBuffer.replace('>', '').trim();
            if (this.resolveRead) {
              this.resolveRead(completeResponse);
              this.resolveRead = null;
            } else {
              this.readQueue.push(completeResponse);
            }
            this.responseBuffer = '';
          }
        };

        this.socket.onerror = (error) => {
          if (!this._connected) {
            reject(new Error('فشل الاتصال عبر WiFi'));
          }
        };

        this.socket.onclose = () => {
          this._connected = false;
          if (this.shouldReconnect) {
            // Attempt to reconnect after 3 seconds
            this.reconnectTimer = setTimeout(() => {
              this.establishConnection().catch(() => {});
            }, 3000);
          }
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
    if (this.readQueue.length > 0) {
      return Promise.resolve(this.readQueue.shift()!);
    }
    return new Promise((resolve) => {
      this.resolveRead = resolve;
    });
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
    }
    this._connected = false;
    this.readQueue = [];
    this.responseBuffer = '';
  }
}
