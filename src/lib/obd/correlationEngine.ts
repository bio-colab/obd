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
  if (categories.network.length > 0 || categories.computer.length > 0) {
    // Rule A: Network or Computer codes are always primary if present
    primarySuspects.push(...categories.network, ...categories.computer);
    riskLevel = 'CRITICAL';
  } else if (categories.sensors.length > 0) {
    // Rule B: Sensor codes usually cause Misfire and Emission codes
    primarySuspects.push(...categories.sensors);
    riskLevel = 'HIGH';
  } else if (categories.fuel.length > 0) {
    // Rule C: Fuel codes can cause Misfire and Emissions
    primarySuspects.push(...categories.fuel);
    riskLevel = 'HIGH';
  } else if (categories.ignition.length > 0) {
    // Rule D: Ignition/Misfire codes can cause Emission codes (Catalyst damage)
    primarySuspects.push(...categories.ignition);
    riskLevel = 'MEDIUM';
  } else {
    // If no clear hierarchy, all are primary
    primarySuspects.push(...dtcs);
  }

  // Assign remaining DTCs correctly
  dtcs.forEach(code => {
    if (!primarySuspects.includes(code)) {
      // Transmission and Speed codes are usually independent of engine sensors
      if (code.startsWith('P07') || code.startsWith('P08') || code.startsWith('P05')) {
        primarySuspects.push(code);
      } else {
        symptomCodes.push(code);
      }
    }
  });

  // 3. Live Data Correlation (Finding anomalies that explain the codes)
  if (liveData.SHRTFT1 !== undefined) {
    if (liveData.SHRTFT1 > 15) dataAnomalies.push("تعديل وقود إيجابي عالي (خليط فقير - احتمال تسريب هواء أو ضعف مضخة)");
    if (liveData.SHRTFT1 < -15) dataAnomalies.push("تعديل وقود سلبي عالي (خليط غني - احتمال تسييل بخاخات أو انسداد هواء)");
  }
  
  if (liveData.EQUIV_RATIO !== undefined) {
    if (liveData.EQUIV_RATIO > 1.05) {
      dataAnomalies.push("نسبة الوقود للهواء (Lambda) تشير إلى خليط فقير (Lean) - احتمال تسريب هواء أو ضعف وقود");
    } else if (liveData.EQUIV_RATIO < 0.95) {
      dataAnomalies.push("نسبة الوقود للهواء (Lambda) تشير إلى خليط غني (Rich) - احتمال تسييل بخاخات أو انسداد هواء");
    }
  }

  if (liveData.TEMP !== undefined) {
    if (liveData.TEMP > 105) { // Adjusted threshold to 105C
      dataAnomalies.push("حرارة المحرك مرتفعة جداً (خطر تلف المحرك)");
      riskLevel = 'CRITICAL';
    }
    if (liveData.TEMP < 60 && liveData.RUNTIME && liveData.RUNTIME > 300) {
      dataAnomalies.push("حرارة المحرك منخفضة بعد فترة تشغيل (احتمال تلف بلف الحرارة Thermostat)");
    }
  }

  if (liveData.CAT_TEMP !== undefined) {
    if ((dtcs.includes('P0420') || dtcs.includes('P0430')) && liveData.CAT_TEMP < 400 && liveData.RUNTIME && liveData.RUNTIME > 600) {
      dataAnomalies.push("حرارة دبة التلوث منخفضة رغم وجود كود ضعف الكفاءة (احتمال تلف الدبة أو تفريغها)");
    }
    if (liveData.CAT_TEMP > 900) {
      dataAnomalies.push("حرارة دبة التلوث مرتفعة جداً (خطر انصهار الدبة بسبب Misfire أو خليط غني)");
      riskLevel = 'CRITICAL';
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
