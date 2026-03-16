import { ConnectionManager } from './ConnectionManager';

// Common ELM327 BLE Service UUIDs
const BLE_SERVICES = [
  '0000fff0-0000-1000-8000-00805f9b34fb', // Standard ELM327 BLE
  '0000ffe0-0000-1000-8000-00805f9b34fb', // Vgate / Some Konnwei
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Other Konnwei variants
];

export class BLEConnection extends ConnectionManager {
  private device: any = null;
  private txCharacteristic: any = null;
  private rxCharacteristic: any = null;
  private responseBuffer: string = '';
  private readQueue: string[] = [];
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
      filters: [{ namePrefix: 'OBD' }, { namePrefix: 'ELM' }, { namePrefix: 'V-LINK' }, { namePrefix: 'KONNWEI' }],
      optionalServices: BLE_SERVICES
    });

    const server = await this.device.gatt.connect();
    
    let service = null;
    for (const uuid of BLE_SERVICES) {
      try {
        service = await server.getPrimaryService(uuid);
        if (service) break;
      } catch (e) {
        // Try next service
      }
    }

    if (!service) {
      throw new Error('لم يتم العثور على خدمة OBD متوافقة في هذا الجهاز');
    }
    
    const characteristics = await service.getCharacteristics();
    
    // Auto-detect TX/RX characteristics based on properties
    for (const char of characteristics) {
      if (char.properties.write || char.properties.writeWithoutResponse) {
        this.txCharacteristic = char;
      }
      if (char.properties.notify || char.properties.indicate) {
        this.rxCharacteristic = char;
      }
    }

    if (!this.txCharacteristic || !this.rxCharacteristic) {
      throw new Error('لم يتم العثور على خصائص القراءة/الكتابة المتوافقة');
    }

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
      const completeResponse = this.responseBuffer.replace('>', '').trim();
      if (this.resolveRead) {
        this.resolveRead(completeResponse);
        this.resolveRead = null;
      } else {
        this.readQueue.push(completeResponse);
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
    if (this.readQueue.length > 0) {
      return Promise.resolve(this.readQueue.shift()!);
    }
    return new Promise((resolve) => {
      this.resolveRead = resolve;
    });
  }

  disconnect(): void {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this._connected = false;
    this.readQueue = [];
    this.responseBuffer = '';
  }
}
