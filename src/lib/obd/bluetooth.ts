import { ConnectionManager } from './ConnectionManager';

const SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const CHAR_TX_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
const CHAR_RX_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

export class BLEConnection extends ConnectionManager {
  private device: any = null;
  private txCharacteristic: any = null;
  private rxCharacteristic: any = null;
  private responseBuffer: string = '';
  private resolveRead: ((value: string) => void) | null = null;

  constructor() {
    super('ble');
  }

  async connect(): Promise<void> {
    if (!('bluetooth' in navigator)) {
      throw new Error('Web Bluetooth API غير مدعوم في هذا المتصفح');
    }

    // @ts-ignore
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'OBD' }, { namePrefix: 'ELM' }],
      optionalServices: [SERVICE_UUID]
    });

    const server = await this.device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    
    this.txCharacteristic = await service.getCharacteristic(CHAR_TX_UUID);
    this.rxCharacteristic = await service.getCharacteristic(CHAR_RX_UUID);

    await this.rxCharacteristic.startNotifications();
    this.rxCharacteristic.addEventListener('characteristicvaluechanged', this.handleNotifications.bind(this));

    this._connected = true;
  }

  private handleNotifications(event: any) {
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(value);
    this.responseBuffer += text;

    if (this.responseBuffer.includes('>')) {
      if (this.resolveRead) {
        this.resolveRead(this.responseBuffer.replace('>', '').trim());
        this.resolveRead = null;
      }
      this.responseBuffer = '';
    }
  }

  async send(cmd: string): Promise<void> {
    if (!this.txCharacteristic) throw new Error('غير متصل');
    const encoder = new TextEncoder();
    await this.txCharacteristic.writeValue(encoder.encode(cmd + '\r'));
  }

  async read(): Promise<string> {
    return new Promise((resolve) => {
      this.resolveRead = resolve;
    });
  }

  disconnect(): void {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this._connected = false;
  }
}
