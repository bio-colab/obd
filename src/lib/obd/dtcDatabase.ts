export const DTC_DATABASE: Record<string, { description: string; causes: string[] }> = {
  // P00xx - Fuel and Air Metering and Auxiliary Emission Controls
  'P0010': { description: '"A" Camshaft Position Actuator Circuit (Bank 1)', causes: ['Faulty VVT sensor', 'Dirty oil', 'Wiring issue'] },
  'P0011': { description: '"A" Camshaft Position - Timing Over-Advanced or System Performance (Bank 1)', causes: ['Low oil level', 'Faulty VVT', 'Timing chain issue'] },
  'P0012': { description: '"A" Camshaft Position - Timing Over-Retarded (Bank 1)', causes: ['Low oil level', 'Faulty VVT', 'Timing chain issue'] },
  'P0013': { description: '"B" Camshaft Position - Actuator Circuit (Bank 1)', causes: ['Faulty exhaust VVT', 'Wiring issue'] },
  'P0014': { description: '"B" Camshaft Position - Timing Over-Advanced or System Performance (Bank 1)', causes: ['Faulty exhaust VVT', 'Timing issue'] },
  'P0030': { description: 'HO2S Heater Control Circuit (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor heater', 'Blown fuse', 'Wiring issue'] },
  'P0031': { description: 'HO2S Heater Control Circuit Low (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor heater', 'Wiring short to ground'] },
  'P0032': { description: 'HO2S Heater Control Circuit High (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor heater', 'Wiring short to power'] },
  'P0050': { description: 'HO2S Heater Control Circuit (Bank 2 Sensor 1)', causes: ['Faulty O2 sensor heater', 'Blown fuse', 'Wiring issue'] },
  
  // P01xx - Fuel and Air Metering
  'P0100': { description: 'Mass or Volume Air Flow "A" Circuit', causes: ['Faulty MAF sensor', 'Intake air leak', 'Wiring issue'] },
  'P0101': { description: 'Mass or Volume Air Flow "A" Circuit Range/Performance', causes: ['Dirty MAF sensor', 'Intake air leak', 'Clogged air filter'] },
  'P0102': { description: 'Mass or Volume Air Flow "A" Circuit Low', causes: ['Faulty MAF sensor', 'Intake air leak', 'Wiring issue'] },
  'P0103': { description: 'Mass or Volume Air Flow "A" Circuit High', causes: ['Faulty MAF sensor', 'Wiring short to power'] },
  'P0110': { description: 'Intake Air Temperature Sensor 1 Circuit', causes: ['Faulty IAT sensor', 'Wiring issue'] },
  'P0111': { description: 'Intake Air Temperature Sensor 1 Circuit Range/Performance', causes: ['Faulty IAT sensor', 'Poor connection'] },
  'P0112': { description: 'Intake Air Temperature Sensor 1 Circuit Low', causes: ['Faulty IAT sensor', 'Wiring short to ground'] },
  'P0113': { description: 'Intake Air Temperature Sensor 1 Circuit High', causes: ['Faulty IAT sensor', 'Wiring short to power', 'Unplugged sensor'] },
  'P0115': { description: 'Engine Coolant Temperature Sensor 1 Circuit', causes: ['Faulty ECT sensor', 'Wiring issue'] },
  'P0116': { description: 'Engine Coolant Temperature Sensor 1 Circuit Range/Performance', causes: ['Faulty ECT sensor', 'Low coolant level', 'Thermostat issue'] },
  'P0117': { description: 'Engine Coolant Temperature Sensor 1 Circuit Low', causes: ['Faulty ECT sensor', 'Wiring short to ground'] },
  'P0118': { description: 'Engine Coolant Temperature Sensor 1 Circuit High', causes: ['Faulty ECT sensor', 'Wiring short to power', 'Unplugged sensor'] },
  'P0120': { description: 'Throttle/Pedal Position Sensor/Switch "A" Circuit', causes: ['Faulty TPS sensor', 'Wiring issue'] },
  'P0121': { description: 'Throttle/Pedal Position Sensor/Switch "A" Circuit Range/Performance', causes: ['Faulty TPS sensor', 'Dirty throttle body'] },
  'P0122': { description: 'Throttle/Pedal Position Sensor/Switch "A" Circuit Low', causes: ['Faulty TPS sensor', 'Wiring short to ground'] },
  'P0123': { description: 'Throttle/Pedal Position Sensor/Switch "A" Circuit High', causes: ['Faulty TPS sensor', 'Wiring short to power'] },
  'P0130': { description: 'O2 Sensor Circuit (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor', 'Exhaust leak', 'Wiring issue'] },
  'P0131': { description: 'O2 Sensor Circuit Low Voltage (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor', 'Exhaust leak', 'Lean fuel mixture'] },
  'P0132': { description: 'O2 Sensor Circuit High Voltage (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor', 'Rich fuel mixture'] },
  'P0133': { description: 'O2 Sensor Circuit Slow Response (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor', 'Exhaust leak'] },
  'P0134': { description: 'O2 Sensor Circuit No Activity Detected (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor', 'Wiring issue'] },
  'P0135': { description: 'O2 Sensor Heater Circuit (Bank 1 Sensor 1)', causes: ['Faulty O2 sensor heater', 'Blown fuse'] },
  'P0171': { description: 'System Too Lean (Bank 1)', causes: ['Vacuum leak', 'Faulty MAF sensor', 'Low fuel pressure', 'Faulty O2 sensor'] },
  'P0172': { description: 'System Too Rich (Bank 1)', causes: ['Leaking fuel injector', 'Faulty MAF sensor', 'Faulty O2 sensor', 'High fuel pressure'] },
  'P0174': { description: 'System Too Lean (Bank 2)', causes: ['Vacuum leak', 'Faulty MAF sensor', 'Low fuel pressure', 'Faulty O2 sensor'] },
  'P0175': { description: 'System Too Rich (Bank 2)', causes: ['Leaking fuel injector', 'Faulty MAF sensor', 'Faulty O2 sensor', 'High fuel pressure'] },

  // P02xx - Fuel and Air Metering (Injector Circuit)
  'P0200': { description: 'Injector Circuit/Open', causes: ['Faulty fuel injector', 'Wiring issue', 'Faulty PCM'] },
  'P0201': { description: 'Injector Circuit/Open - Cylinder 1', causes: ['Faulty fuel injector 1', 'Wiring issue'] },
  'P0202': { description: 'Injector Circuit/Open - Cylinder 2', causes: ['Faulty fuel injector 2', 'Wiring issue'] },
  'P0203': { description: 'Injector Circuit/Open - Cylinder 3', causes: ['Faulty fuel injector 3', 'Wiring issue'] },
  'P0204': { description: 'Injector Circuit/Open - Cylinder 4', causes: ['Faulty fuel injector 4', 'Wiring issue'] },
  'P0230': { description: 'Fuel Pump Primary Circuit', causes: ['Faulty fuel pump relay', 'Wiring issue', 'Faulty fuel pump'] },
  'P0234': { description: 'Turbocharger/Supercharger Overboost Condition', causes: ['Faulty wastegate', 'Faulty boost sensor', 'Vacuum leak'] },
  'P0299': { description: 'Turbocharger/Supercharger Underboost', causes: ['Boost leak', 'Faulty turbocharger', 'Faulty wastegate'] },

  // P03xx - Ignition System or Misfire
  'P0300': { description: 'Random/Multiple Cylinder Misfire Detected', causes: ['Faulty spark plugs', 'Faulty ignition coils', 'Vacuum leak', 'Low fuel pressure', 'Faulty MAF sensor'] },
  'P0301': { description: 'Cylinder 1 Misfire Detected', causes: ['Faulty spark plug 1', 'Faulty ignition coil 1', 'Faulty fuel injector 1', 'Low compression'] },
  'P0302': { description: 'Cylinder 2 Misfire Detected', causes: ['Faulty spark plug 2', 'Faulty ignition coil 2', 'Faulty fuel injector 2', 'Low compression'] },
  'P0303': { description: 'Cylinder 3 Misfire Detected', causes: ['Faulty spark plug 3', 'Faulty ignition coil 3', 'Faulty fuel injector 3', 'Low compression'] },
  'P0304': { description: 'Cylinder 4 Misfire Detected', causes: ['Faulty spark plug 4', 'Faulty ignition coil 4', 'Faulty fuel injector 4', 'Low compression'] },
  'P0325': { description: 'Knock Sensor 1 Circuit (Bank 1 or Single Sensor)', causes: ['Faulty knock sensor', 'Wiring issue', 'Engine knock/detonation'] },
  'P0335': { description: 'Crankshaft Position Sensor "A" Circuit', causes: ['Faulty crankshaft position sensor', 'Wiring issue', 'Timing issue'] },
  'P0340': { description: 'Camshaft Position Sensor "A" Circuit', causes: ['Faulty camshaft position sensor', 'Wiring issue', 'Timing issue'] },

  // P04xx - Auxiliary Emission Controls
  'P0400': { description: 'Exhaust Gas Recirculation Flow', causes: ['Faulty EGR valve', 'Clogged EGR passages', 'Vacuum leak'] },
  'P0401': { description: 'Exhaust Gas Recirculation Flow Insufficient Detected', causes: ['Clogged EGR passages', 'Faulty EGR valve'] },
  'P0402': { description: 'Exhaust Gas Recirculation Flow Excessive Detected', causes: ['Faulty EGR valve', 'EGR valve stuck open'] },
  'P0420': { description: 'Catalyst System Efficiency Below Threshold (Bank 1)', causes: ['Faulty catalytic converter', 'Faulty O2 sensor', 'Exhaust leak'] },
  'P0430': { description: 'Catalyst System Efficiency Below Threshold (Bank 2)', causes: ['Faulty catalytic converter', 'Faulty O2 sensor', 'Exhaust leak'] },
  'P0440': { description: 'Evaporative Emission System', causes: ['Loose gas cap', 'Faulty purge valve', 'EVAP leak'] },
  'P0441': { description: 'Evaporative Emission System Incorrect Purge Flow', causes: ['Faulty purge valve', 'Clogged EVAP canister'] },
  'P0442': { description: 'Evaporative Emission System Leak Detected (small leak)', causes: ['Loose gas cap', 'Small EVAP leak', 'Faulty purge valve'] },
  'P0455': { description: 'Evaporative Emission System Leak Detected (large leak)', causes: ['Missing/loose gas cap', 'Large EVAP leak', 'Disconnected EVAP hose'] },
  'P0460': { description: 'Fuel Level Sensor "A" Circuit', causes: ['Faulty fuel level sensor', 'Wiring issue'] },

  // P05xx - Vehicle Speed, Idle Control, and Auxiliary Inputs
  'P0500': { description: 'Vehicle Speed Sensor "A" Circuit', causes: ['Faulty VSS', 'Wiring issue', 'Faulty instrument cluster'] },
  'P0505': { description: 'Idle Air Control System', causes: ['Faulty IAC valve', 'Vacuum leak', 'Dirty throttle body'] },
  'P0507': { description: 'Idle Air Control System RPM Higher Than Expected', causes: ['Vacuum leak', 'Faulty IAC valve', 'Dirty throttle body'] },
  'P0520': { description: 'Engine Oil Pressure Sensor/Switch Circuit', causes: ['Faulty oil pressure sensor', 'Low oil pressure', 'Wiring issue'] },

  // P06xx - Computer and Output Circuits
  'P0601': { description: 'Internal Control Module Memory Check Sum Error', causes: ['Faulty PCM/ECM', 'Programming error'] },
  'P0603': { description: 'Internal Control Module Keep Alive Memory (KAM) Error', causes: ['Battery disconnected', 'Faulty PCM/ECM', 'Low battery voltage'] },
  'P0606': { description: 'ECM/PCM Processor', causes: ['Faulty PCM/ECM'] },

  // P07xx - Transmission
  'P0700': { description: 'Transmission Control System (MIL Request)', causes: ['Faulty TCM', 'Transmission issue (check TCM codes)'] },
  'P0705': { description: 'Transmission Range Sensor Circuit Malfunction (PRNDL Input)', causes: ['Faulty neutral safety switch', 'Wiring issue'] },
  'P0715': { description: 'Input/Turbine Speed Sensor "A" Circuit', causes: ['Faulty input speed sensor', 'Wiring issue', 'Transmission fluid issue'] },
  'P0720': { description: 'Output Speed Sensor Circuit', causes: ['Faulty output speed sensor', 'Wiring issue'] },
  'P0730': { description: 'Incorrect Gear Ratio', causes: ['Low transmission fluid', 'Faulty shift solenoid', 'Internal transmission failure'] },
  'P0740': { description: 'Torque Converter Clutch Circuit Malfunction', causes: ['Faulty TCC solenoid', 'Wiring issue', 'Faulty torque converter'] },

  // U-Codes - Network
  'U0001': { description: 'High Speed CAN Communication Bus', causes: ['Wiring issue on CAN bus', 'Faulty module on network'] },
  'U0100': { description: 'Lost Communication With ECM/PCM "A"', causes: ['Faulty PCM', 'Wiring issue', 'Blown fuse'] },
  'U0101': { description: 'Lost Communication with TCM', causes: ['Faulty TCM', 'Wiring issue', 'Blown fuse'] },
};
