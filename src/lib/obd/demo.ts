import { ConnectionManager } from './ConnectionManager';

export class DemoConnection extends ConnectionManager {
  private interval: any;
  private speed = 0;
  private rpm = 800;
  private temp = 40; // Starts cold
  private voltage = 12.6; // Battery resting voltage
  private load = 0;
  private throttle = 0;
  private map = 30; // Idle vacuum
  private maf = 4;
  private timing = 10;
  private stft = 0;
  private ltft = 0;
  private iat = 35;
  private oilTemp = 40;
  private catTemp = 150;
  private fuelLevel = 75;
  private fuelRail = 40000;
  private absLoad = 0;
  private lambda = 1.0;
  private runtime = 0;
  private baro = 100;
  private fuelPressure = 300;
  private ambientTemp = 35;
  private accelD = 0;
  private accelE = 0;
  private timeMil = 120;
  private responseQueue: string[] = [];
  
  // Physics simulation state
  private gear = 1;
  private isAccelerating = false;
  private isBraking = false;
  private targetSpeed = 0;

  constructor() {
    super('wifi'); // Use wifi as base type for UI purposes
    this.type = 'wifi';
  }

  async connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._connected = true;
        this.voltage = 14.2; // Alternator kicks in
        this.startSimulation();
        resolve();
      }, 500);
    });
  }

  private startSimulation() {
    this.runtime = 0;
    
    // Change target speed every 10-20 seconds to simulate traffic
    setInterval(() => {
      if (Math.random() > 0.3) {
        this.targetSpeed = Math.floor(Math.random() * 120); // 0 to 120 km/h
      } else {
        this.targetSpeed = 0; // Stop
      }
    }, 15000);

    this.interval = setInterval(() => {
      this.runtime += 1;
      
      // 1. Physics & Speed Simulation
      const speedDiff = this.targetSpeed - this.speed;
      
      if (speedDiff > 2) {
        // Accelerating
        this.isAccelerating = true;
        this.isBraking = false;
        this.throttle = Math.min(80, 20 + (speedDiff * 1.5)); // Harder accel for bigger diff
        const accelRate = (this.throttle / 100) * 8; // Max 8 km/h per sec
        this.speed += accelRate;
      } else if (speedDiff < -2) {
        // Braking
        this.isAccelerating = false;
        this.isBraking = true;
        this.throttle = 0;
        const brakeRate = Math.min(15, Math.abs(speedDiff) * 0.5); // Max 15 km/h per sec braking
        this.speed -= brakeRate;
      } else {
        // Cruising
        this.isAccelerating = false;
        this.isBraking = false;
        this.throttle = this.speed > 0 ? 10 + (this.speed * 0.1) : 0; // Just enough to maintain speed
        this.speed = this.targetSpeed;
      }

      this.speed = Math.max(0, this.speed);

      // 2. Transmission (Gears) & RPM Simulation
      if (this.speed === 0) {
        this.gear = 1;
        this.rpm = 800 + (Math.random() * 20 - 10); // Idle fluctuation
      } else {
        // Simple 6-speed auto simulation
        if (this.speed < 20) this.gear = 1;
        else if (this.speed < 40) this.gear = 2;
        else if (this.speed < 60) this.gear = 3;
        else if (this.speed < 80) this.gear = 4;
        else if (this.speed < 100) this.gear = 5;
        else this.gear = 6;

        // RPM based on speed and gear ratio
        const gearRatios = [0, 120, 80, 60, 45, 35, 25]; // RPM per km/h
        const baseRpm = this.speed * gearRatios[this.gear];
        
        // Add torque converter slip / throttle response
        const slipRpm = this.isAccelerating ? (this.throttle * 15) : 0;
        
        this.rpm = Math.min(6500, Math.max(800, baseRpm + slipRpm));
      }

      // 3. Engine Load & Airflow
      if (this.speed === 0) {
        this.load = 20 + (Math.random() * 2); // Idle load
      } else {
        // Load is high during accel, low during cruise, 0 during braking (decel fuel cut)
        if (this.isBraking) this.load = 0;
        else if (this.isAccelerating) this.load = Math.min(100, 40 + this.throttle * 0.6);
        else this.load = 25 + (this.speed * 0.1); // Cruise load
      }

      // MAP (Manifold Absolute Pressure) - Inversely related to vacuum
      // Idle = high vacuum = low MAP (~30 kPa)
      // WOT = zero vacuum = high MAP (~100 kPa)
      this.map = this.isBraking ? 20 : 30 + (this.load * 0.7);

      // MAF (Mass Air Flow) - Proportional to RPM and MAP
      this.maf = (this.rpm * this.map) / 3000;

      // 4. Temperatures (Warm-up simulation)
      if (this.temp < 90) {
        this.temp += (this.rpm / 3000) * 0.5; // Warms up faster at higher RPM
      } else {
        // Operating temp fluctuation based on load
        this.temp = 90 + (this.load * 0.05) + (Math.random() * 2 - 1);
      }
      
      this.oilTemp = this.temp + 5;
      
      // Cat temp reacts quickly to load
      const targetCatTemp = 400 + (this.load * 4);
      this.catTemp += (targetCatTemp - this.catTemp) * 0.1;

      // 5. Fuel Trims & O2 Sensor (Simulating P0171 - System Too Lean)
      // We changed the DTC to P0171 to make the data physically consistent
      this.stft = 15 + (Math.random() * 5); // Consistently high positive trim (adding fuel)
      this.ltft = 20 + (Math.random() * 2); // Long term has adapted to lean condition
      this.lambda = 1.05 + (Math.random() * 0.02); // Still running slightly lean despite trims

      // 6. Other sensors
      this.voltage = 13.8 + (this.rpm > 1000 ? 0.4 : 0) + (Math.random() * 0.1);
      this.timing = Math.min(40, Math.max(-5, (this.rpm / 150) - (this.load / 10) + 10));
      this.fuelPressure = 300 + (this.map * 0.5);
      this.absLoad = this.load * 0.8;
      this.accelD = this.throttle;
      this.accelE = this.throttle;
      
      if (this.runtime % 60 === 0) this.fuelLevel = Math.max(0, this.fuelLevel - 0.1);

    }, 1000);
  }

  private toHex(value: number, bytes: number): string {
    const max = Math.pow(256, bytes) - 1;
    const clamped = Math.max(0, Math.min(max, Math.round(value)));
    const hex = clamped.toString(16).padStart(bytes * 2, '0').toUpperCase();
    if (bytes === 1) return hex;
    if (bytes === 2) return `${hex.substring(0, 2)} ${hex.substring(2, 4)}`;
    return hex;
  }

  async send(cmd: string): Promise<void> {
    if (!this._connected) throw new Error('Not connected');
    
    // Clean command
    const cleanCmd = cmd.replace(/\s/g, '').toUpperCase().replace('\r', '');
    let response = 'NO DATA>';

    if (cleanCmd.startsWith('AT')) {
      response = 'OK>';
    } else if (cleanCmd === '0100') { // Supported PIDs 01-20
      response = '41 00 BE 1F B8 10>';
    } else if (cleanCmd === '0120') { // Supported PIDs 21-40
      response = '41 20 90 05 B0 11>';
    } else if (cleanCmd === '0140') { // Supported PIDs 41-60
      response = '41 40 7A DC 80 00>';
    } else if (cleanCmd === '0104') { // Load
      response = `41 04 ${this.toHex(this.load * 2.55, 1)}>`;
    } else if (cleanCmd === '0105') { // Temp
      response = `41 05 ${this.toHex(this.temp + 40, 1)}>`;
    } else if (cleanCmd === '0106') { // STFT
      response = `41 06 ${this.toHex((this.stft * 1.28) + 128, 1)}>`;
    } else if (cleanCmd === '0107') { // LTFT
      response = `41 07 ${this.toHex((this.ltft * 1.28) + 128, 1)}>`;
    } else if (cleanCmd === '010A') { // Fuel Pressure
      response = `41 0A ${this.toHex(this.fuelPressure / 3, 1)}>`;
    } else if (cleanCmd === '010B') { // MAP
      response = `41 0B ${this.toHex(this.map, 1)}>`;
    } else if (cleanCmd === '010C') { // RPM
      response = `41 0C ${this.toHex(this.rpm * 4, 2)}>`;
    } else if (cleanCmd === '010D') { // Speed
      response = `41 0D ${this.toHex(this.speed, 1)}>`;
    } else if (cleanCmd === '010E') { // Timing
      response = `41 0E ${this.toHex((this.timing + 64) * 2, 1)}>`;
    } else if (cleanCmd === '010F') { // IAT
      response = `41 0F ${this.toHex(this.iat + 40, 1)}>`;
    } else if (cleanCmd === '0110') { // MAF
      response = `41 10 ${this.toHex(this.maf * 100, 2)}>`;
    } else if (cleanCmd === '0111') { // Throttle
      response = `41 11 ${this.toHex(this.throttle * 2.55, 1)}>`;
    } else if (cleanCmd === '011F') { // Runtime
      response = `41 1F ${this.toHex(this.runtime, 2)}>`;
    } else if (cleanCmd === '0123') { // Fuel Rail Pressure
      response = `41 23 ${this.toHex(this.fuelRail / 10, 2)}>`;
    } else if (cleanCmd === '012F') { // Fuel Level
      response = `41 2F ${this.toHex(this.fuelLevel * 2.55, 1)}>`;
    } else if (cleanCmd === '0133') { // BARO
      response = `41 33 ${this.toHex(this.baro, 1)}>`;
    } else if (cleanCmd === '013C') { // Cat Temp
      response = `41 3C ${this.toHex((this.catTemp + 40) * 10, 2)}>`;
    } else if (cleanCmd === '0142') { // Voltage
      response = `41 42 ${this.toHex(this.voltage * 1000, 2)}>`;
    } else if (cleanCmd === '0143') { // Abs Load
      response = `41 43 ${this.toHex(this.absLoad * 2.55, 2)}>`;
    } else if (cleanCmd === '0144') { // Lambda
      response = `41 44 ${this.toHex(this.lambda * 32768, 2)}>`;
    } else if (cleanCmd === '0146') { // Ambient Temp
      response = `41 46 ${this.toHex(this.ambientTemp + 40, 1)}>`;
    } else if (cleanCmd === '0149') { // Accel D
      response = `41 49 ${this.toHex(this.accelD * 2.55, 1)}>`;
    } else if (cleanCmd === '014A') { // Accel E
      response = `41 4A ${this.toHex(this.accelE * 2.55, 1)}>`;
    } else if (cleanCmd === '014D') { // Time MIL
      response = `41 4D ${this.toHex(this.timeMil, 2)}>`;
    } else if (cleanCmd === '015C') { // Oil Temp
      response = `41 5C ${this.toHex(this.oilTemp + 40, 1)}>`;
    } else if (cleanCmd === '03') { // Read DTCs
      response = '43 01 71 00 00 00 00>'; // Changed to P0171 (System Too Lean) to match the physics
    } else if (cleanCmd === '04') { // Clear DTCs
      response = '44>';
    } else if (cleanCmd === '0902') { // VIN
      response = '49 02 01 31 48 47 43 4D 38 32 36 33 33 41 30 30 34 33 35 32>'; // Valid Honda Accord VIN format
    } else if (cleanCmd === '0904') { // Calibration ID
      response = '49 04 01 43 41 4C 49 42 52 41 54 49 4F 4E 31 32 33 34 35>';
    } else if (cleanCmd === '0101') { // Readiness
      // MIL ON, 1 DTC, Misfire/Fuel/Comp OK, Catalyst/O2/Heater/EGR OK
      response = '41 01 81 07 65 00>'; 
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
