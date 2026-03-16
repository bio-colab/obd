export interface CorrelationAnalysis {
  primarySuspects: string[];
  symptomCodes: string[];
  dataAnomalies: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export function analyzeDTCsAndData(dtcs: string[], liveData: Record<string, number>): CorrelationAnalysis {
  // 1. Categorize DTCs
  const categories = {
    sensors: dtcs.filter(c => c.startsWith('P01')), // Air/Fuel sensors (MAF, O2, MAP, ECT)
    fuel: dtcs.filter(c => c.startsWith('P02')),    // Fuel Injectors/Pumps
    ignition: dtcs.filter(c => c.startsWith('P03')), // Misfire/Ignition
    emissions: dtcs.filter(c => c.startsWith('P04')), // Catalyst/Evap/EGR
    speed: dtcs.filter(c => c.startsWith('P05')),   // VSS/Idle Control
    computer: dtcs.filter(c => c.startsWith('P06')), // PCM/ECU
    transmission: dtcs.filter(c => c.startsWith('P07') || c.startsWith('P08')), // Transmission
    network: dtcs.filter(c => c.startsWith('U')),   // Network/CAN
  };

  let primarySuspects: string[] = [];
  let symptomCodes: string[] = [];
  let dataAnomalies: string[] = [];
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

  // 2. Correlation Logic (Root Cause vs Symptom)
  // Rule A: Network or Computer codes are always primary if present
  if (categories.network.length > 0 || categories.computer.length > 0) {
    primarySuspects.push(...categories.network, ...categories.computer);
    symptomCodes.push(...dtcs.filter(c => !primarySuspects.includes(c)));
    riskLevel = 'CRITICAL';
  } 
  // Rule B: Sensor codes usually cause Misfire and Emission codes
  else if (categories.sensors.length > 0) {
    primarySuspects.push(...categories.sensors);
    symptomCodes.push(...categories.ignition, ...categories.emissions, ...categories.fuel);
    riskLevel = 'HIGH';
  } 
  // Rule C: Fuel codes can cause Misfire and Emissions
  else if (categories.fuel.length > 0) {
    primarySuspects.push(...categories.fuel);
    symptomCodes.push(...categories.ignition, ...categories.emissions);
    riskLevel = 'HIGH';
  }
  // Rule D: Ignition/Misfire codes can cause Emission codes (Catalyst damage)
  else if (categories.ignition.length > 0) {
    primarySuspects.push(...categories.ignition);
    symptomCodes.push(...categories.emissions);
    riskLevel = 'MEDIUM';
  } else {
    primarySuspects.push(...dtcs);
  }

  // 3. Live Data Correlation (Finding anomalies that explain the codes)
  if (liveData.SHRTFT1 !== undefined) {
    if (liveData.SHRTFT1 > 15) dataAnomalies.push("تعديل وقود إيجابي عالي (خليط فقير - احتمال تسريب هواء أو ضعف مضخة)");
    if (liveData.SHRTFT1 < -15) dataAnomalies.push("تعديل وقود سلبي عالي (خليط غني - احتمال تسييل بخاخات أو انسداد هواء)");
  }
  
  if (liveData.TEMP !== undefined) {
    if (liveData.TEMP > 110) { // Increased threshold to 110C for modern engines
      dataAnomalies.push("حرارة المحرك مرتفعة جداً (خطر تلف المحرك)");
      riskLevel = 'CRITICAL';
    }
    if (liveData.TEMP < 60 && liveData.RUNTIME && liveData.RUNTIME > 300) {
      dataAnomalies.push("حرارة المحرك منخفضة بعد فترة تشغيل (احتمال تلف بلف الحرارة Thermostat)");
    }
  }

  if (liveData.BATTERY !== undefined) {
    // Battery threshold adjusted based on engine state (running vs off)
    const isRunning = liveData.RPM && liveData.RPM > 400;
    if (isRunning && liveData.BATTERY < 13.0) {
      dataAnomalies.push("جهد شحن منخفض أثناء عمل المحرك (احتمال ضعف الدينامو)");
    } else if (!isRunning && liveData.BATTERY < 11.5) {
      dataAnomalies.push("جهد البطارية منخفض (قد يتسبب في ظهور أعطال وهمية للحساسات)");
    }
    
    if (liveData.BATTERY > 15.2) {
      dataAnomalies.push("جهد شحن زائد من الدينامو (خطر على كمبيوتر السيارة)");
      riskLevel = 'CRITICAL';
    }
  }

  if (liveData.MAP !== undefined && liveData.RPM !== undefined) {
    // MAP threshold is relative to RPM and Load
    if (liveData.RPM < 1000 && liveData.MAP > 60 && liveData.LOAD && liveData.LOAD < 30) {
      dataAnomalies.push("ضغط المشعب (MAP) مرتفع أثناء الخمول (احتمال تسريب هواء Vacuum Leak أو مشكلة في التوقيت)");
    }
  }

  return {
    primarySuspects: [...new Set(primarySuspects)],
    symptomCodes: [...new Set(symptomCodes)],
    dataAnomalies,
    riskLevel
  };
}
