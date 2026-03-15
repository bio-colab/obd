export abstract class ConnectionManager {
  type: 'usb' | 'ble' | 'wifi';
  protected _connected: boolean = false;

  constructor(type: 'usb' | 'ble' | 'wifi') {
    this.type = type;
  }

  abstract connect(): Promise<void>;
  abstract send(cmd: string): Promise<void>;
  abstract read(): Promise<string>;
  abstract disconnect(): void;

  get isConnected() {
    return this._connected;
  }
}
