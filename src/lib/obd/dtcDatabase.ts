export const DTC_DATABASE: Record<string, { description: { ar: string; en: string }; causes: { ar: string[]; en: string[] } }> = {
  // P00xx - Fuel and Air Metering and Auxiliary Emission Controls
  'P0010': { 
    description: { ar: 'دائرة مشغل موضع عمود الكامات "A" (الضفة 1)', en: '"A" Camshaft Position Actuator Circuit (Bank 1)' }, 
    causes: { ar: ['حساس VVT تالف', 'زيت متسخ', 'مشكلة في التوصيلات'], en: ['Faulty VVT sensor', 'Dirty oil', 'Wiring issue'] } 
  },
  'P0011': { 
    description: { ar: 'موضع عمود الكامات "A" - توقيت متقدم جداً أو أداء النظام (الضفة 1)', en: '"A" Camshaft Position - Timing Over-Advanced or System Performance (Bank 1)' }, 
    causes: { ar: ['مستوى زيت منخفض', 'VVT تالف', 'مشكلة في جنزير الصدر'], en: ['Low oil level', 'Faulty VVT', 'Timing chain issue'] } 
  },
  'P0012': { 
    description: { ar: 'موضع عمود الكامات "A" - توقيت متأخر جداً (الضفة 1)', en: '"A" Camshaft Position - Timing Over-Retarded (Bank 1)' }, 
    causes: { ar: ['مستوى زيت منخفض', 'VVT تالف', 'مشكلة في جنزير الصدر'], en: ['Low oil level', 'Faulty VVT', 'Timing chain issue'] } 
  },
  'P0013': { 
    description: { ar: 'دائرة مشغل موضع عمود الكامات "B" (الضفة 1)', en: '"B" Camshaft Position - Actuator Circuit (Bank 1)' }, 
    causes: { ar: ['VVT العادم تالف', 'مشكلة في التوصيلات'], en: ['Faulty exhaust VVT', 'Wiring issue'] } 
  },
  'P0014': { 
    description: { ar: 'موضع عمود الكامات "B" - توقيت متقدم جداً أو أداء النظام (الضفة 1)', en: '"B" Camshaft Position - Timing Over-Advanced or System Performance (Bank 1)' }, 
    causes: { ar: ['VVT العادم تالف', 'مشكلة في التوقيت'], en: ['Faulty exhaust VVT', 'Timing issue'] } 
  },
  'P0030': { 
    description: { ar: 'دائرة التحكم في سخان حساس الأكسجين (الضفة 1 الحساس 1)', en: 'HO2S Heater Control Circuit (Bank 1 Sensor 1)' }, 
    causes: { ar: ['سخان حساس الأكسجين تالف', 'فيوز محترق', 'مشكلة في التوصيلات'], en: ['Faulty O2 sensor heater', 'Blown fuse', 'Wiring issue'] } 
  },
  'P0031': { 
    description: { ar: 'دائرة التحكم في سخان حساس الأكسجين منخفضة (الضفة 1 الحساس 1)', en: 'HO2S Heater Control Circuit Low (Bank 1 Sensor 1)' }, 
    causes: { ar: ['سخان حساس الأكسجين تالف', 'تماس كهربائي مع الأرضي'], en: ['Faulty O2 sensor heater', 'Wiring short to ground'] } 
  },
  'P0032': { 
    description: { ar: 'دائرة التحكم في سخان حساس الأكسجين مرتفعة (الضفة 1 الحساس 1)', en: 'HO2S Heater Control Circuit High (Bank 1 Sensor 1)' }, 
    causes: { ar: ['سخان حساس الأكسجين تالف', 'تماس كهربائي مع الموجب'], en: ['Faulty O2 sensor heater', 'Wiring short to power'] } 
  },
  'P0050': { 
    description: { ar: 'دائرة التحكم في سخان حساس الأكسجين (الضفة 2 الحساس 1)', en: 'HO2S Heater Control Circuit (Bank 2 Sensor 1)' }, 
    causes: { ar: ['سخان حساس الأكسجين تالف', 'فيوز محترق', 'مشكلة في التوصيلات'], en: ['Faulty O2 sensor heater', 'Blown fuse', 'Wiring issue'] } 
  },
  
  // P01xx - Fuel and Air Metering
  'P0100': { 
    description: { ar: 'دائرة حساس تدفق الهواء (MAF) "A"', en: 'Mass or Volume Air Flow "A" Circuit' }, 
    causes: { ar: ['حساس MAF تالف', 'تسريب هواء في الثلاجة', 'مشكلة في التوصيلات'], en: ['Faulty MAF sensor', 'Intake air leak', 'Wiring issue'] } 
  },
  'P0101': { 
    description: { ar: 'نطاق/أداء دائرة حساس تدفق الهواء (MAF) "A"', en: 'Mass or Volume Air Flow "A" Circuit Range/Performance' }, 
    causes: { ar: ['حساس MAF متسخ', 'تسريب هواء في الثلاجة', 'فلتر هواء مسدود'], en: ['Dirty MAF sensor', 'Intake air leak', 'Clogged air filter'] } 
  },
  'P0102': { 
    description: { ar: 'دائرة حساس تدفق الهواء (MAF) "A" منخفضة', en: 'Mass or Volume Air Flow "A" Circuit Low' }, 
    causes: { ar: ['حساس MAF تالف', 'تسريب هواء في الثلاجة', 'مشكلة في التوصيلات'], en: ['Faulty MAF sensor', 'Intake air leak', 'Wiring issue'] } 
  },
  'P0103': { 
    description: { ar: 'دائرة حساس تدفق الهواء (MAF) "A" مرتفعة', en: 'Mass or Volume Air Flow "A" Circuit High' }, 
    causes: { ar: ['حساس MAF تالف', 'تماس كهربائي مع الموجب'], en: ['Faulty MAF sensor', 'Wiring short to power'] } 
  },
  'P0110': { 
    description: { ar: 'دائرة حساس حرارة هواء السحب 1', en: 'Intake Air Temperature Sensor 1 Circuit' }, 
    causes: { ar: ['حساس IAT تالف', 'مشكلة في التوصيلات'], en: ['Faulty IAT sensor', 'Wiring issue'] } 
  },
  'P0111': { 
    description: { ar: 'نطاق/أداء دائرة حساس حرارة هواء السحب 1', en: 'Intake Air Temperature Sensor 1 Circuit Range/Performance' }, 
    causes: { ar: ['حساس IAT تالف', 'توصيل ضعيف'], en: ['Faulty IAT sensor', 'Poor connection'] } 
  },
  'P0112': { 
    description: { ar: 'دائرة حساس حرارة هواء السحب 1 منخفضة', en: 'Intake Air Temperature Sensor 1 Circuit Low' }, 
    causes: { ar: ['حساس IAT تالف', 'تماس كهربائي مع الأرضي'], en: ['Faulty IAT sensor', 'Wiring short to ground'] } 
  },
  'P0113': { 
    description: { ar: 'دائرة حساس حرارة هواء السحب 1 مرتفعة', en: 'Intake Air Temperature Sensor 1 Circuit High' }, 
    causes: { ar: ['حساس IAT تالف', 'تماس كهربائي مع الموجب', 'حساس مفصول'], en: ['Faulty IAT sensor', 'Wiring short to power', 'Unplugged sensor'] } 
  },
  'P0115': { 
    description: { ar: 'دائرة حساس حرارة سائل تبريد المحرك 1', en: 'Engine Coolant Temperature Sensor 1 Circuit' }, 
    causes: { ar: ['حساس ECT تالف', 'مشكلة في التوصيلات'], en: ['Faulty ECT sensor', 'Wiring issue'] } 
  },
  'P0116': { 
    description: { ar: 'نطاق/أداء دائرة حساس حرارة سائل تبريد المحرك 1', en: 'Engine Coolant Temperature Sensor 1 Circuit Range/Performance' }, 
    causes: { ar: ['حساس ECT تالف', 'نقص في ماء الرديتر', 'مشكلة في البلف (الثرموستات)'], en: ['Faulty ECT sensor', 'Low coolant level', 'Thermostat issue'] } 
  },
  'P0117': { 
    description: { ar: 'دائرة حساس حرارة سائل تبريد المحرك 1 منخفضة', en: 'Engine Coolant Temperature Sensor 1 Circuit Low' }, 
    causes: { ar: ['حساس ECT تالف', 'تماس كهربائي مع الأرضي'], en: ['Faulty ECT sensor', 'Wiring short to ground'] } 
  },
  'P0118': { 
    description: { ar: 'دائرة حساس حرارة سائل تبريد المحرك 1 مرتفعة', en: 'Engine Coolant Temperature Sensor 1 Circuit High' }, 
    causes: { ar: ['حساس ECT تالف', 'تماس كهربائي مع الموجب', 'حساس مفصول'], en: ['Faulty ECT sensor', 'Wiring short to power', 'Unplugged sensor'] } 
  },
  'P0120': { 
    description: { ar: 'دائرة حساس/مفتاح موضع الخانق/الدواسة "A"', en: 'Throttle/Pedal Position Sensor/Switch "A" Circuit' }, 
    causes: { ar: ['حساس TPS تالف', 'مشكلة في التوصيلات'], en: ['Faulty TPS sensor', 'Wiring issue'] } 
  },
  'P0121': { 
    description: { ar: 'نطاق/أداء دائرة حساس/مفتاح موضع الخانق/الدواسة "A"', en: 'Throttle/Pedal Position Sensor/Switch "A" Circuit Range/Performance' }, 
    causes: { ar: ['حساس TPS تالف', 'بوابة الهواء (الثروتل) متسخة'], en: ['Faulty TPS sensor', 'Dirty throttle body'] } 
  },
  'P0122': { 
    description: { ar: 'دائرة حساس/مفتاح موضع الخانق/الدواسة "A" منخفضة', en: 'Throttle/Pedal Position Sensor/Switch "A" Circuit Low' }, 
    causes: { ar: ['حساس TPS تالف', 'تماس كهربائي مع الأرضي'], en: ['Faulty TPS sensor', 'Wiring short to ground'] } 
  },
  'P0123': { 
    description: { ar: 'دائرة حساس/مفتاح موضع الخانق/الدواسة "A" مرتفعة', en: 'Throttle/Pedal Position Sensor/Switch "A" Circuit High' }, 
    causes: { ar: ['حساس TPS تالف', 'تماس كهربائي مع الموجب'], en: ['Faulty TPS sensor', 'Wiring short to power'] } 
  },
  'P0130': { 
    description: { ar: 'دائرة حساس الأكسجين (الضفة 1 الحساس 1)', en: 'O2 Sensor Circuit (Bank 1 Sensor 1)' }, 
    causes: { ar: ['حساس الأكسجين تالف', 'تسريب في العادم', 'مشكلة في التوصيلات'], en: ['Faulty O2 sensor', 'Exhaust leak', 'Wiring issue'] } 
  },
  'P0131': { 
    description: { ar: 'جهد دائرة حساس الأكسجين منخفض (الضفة 1 الحساس 1)', en: 'O2 Sensor Circuit Low Voltage (Bank 1 Sensor 1)' }, 
    causes: { ar: ['حساس الأكسجين تالف', 'تسريب في العادم', 'خليط وقود فقير'], en: ['Faulty O2 sensor', 'Exhaust leak', 'Lean fuel mixture'] } 
  },
  'P0132': { 
    description: { ar: 'جهد دائرة حساس الأكسجين مرتفع (الضفة 1 الحساس 1)', en: 'O2 Sensor Circuit High Voltage (Bank 1 Sensor 1)' }, 
    causes: { ar: ['حساس الأكسجين تالف', 'خليط وقود غني'], en: ['Faulty O2 sensor', 'Rich fuel mixture'] } 
  },
  'P0133': { 
    description: { ar: 'استجابة دائرة حساس الأكسجين بطيئة (الضفة 1 الحساس 1)', en: 'O2 Sensor Circuit Slow Response (Bank 1 Sensor 1)' }, 
    causes: { ar: ['حساس الأكسجين تالف', 'تسريب في العادم'], en: ['Faulty O2 sensor', 'Exhaust leak'] } 
  },
  'P0134': { 
    description: { ar: 'لا يوجد نشاط في دائرة حساس الأكسجين (الضفة 1 الحساس 1)', en: 'O2 Sensor Circuit No Activity Detected (Bank 1 Sensor 1)' }, 
    causes: { ar: ['حساس الأكسجين تالف', 'مشكلة في التوصيلات'], en: ['Faulty O2 sensor', 'Wiring issue'] } 
  },
  'P0135': { 
    description: { ar: 'دائرة سخان حساس الأكسجين (الضفة 1 الحساس 1)', en: 'O2 Sensor Heater Circuit (Bank 1 Sensor 1)' }, 
    causes: { ar: ['سخان حساس الأكسجين تالف', 'فيوز محترق'], en: ['Faulty O2 sensor heater', 'Blown fuse'] } 
  },
  'P0171': { 
    description: { ar: 'النظام فقير جداً (الضفة 1)', en: 'System Too Lean (Bank 1)' }, 
    causes: { ar: ['تسريب فاكيوم', 'حساس MAF تالف', 'ضغط وقود ضعيف', 'حساس أكسجين تالف'], en: ['Vacuum leak', 'Faulty MAF sensor', 'Low fuel pressure', 'Faulty O2 sensor'] } 
  },
  'P0172': { 
    description: { ar: 'النظام غني جداً (الضفة 1)', en: 'System Too Rich (Bank 1)' }, 
    causes: { ar: ['بخاخ وقود يسرب', 'حساس MAF تالف', 'حساس أكسجين تالف', 'ضغط وقود عالي'], en: ['Leaking fuel injector', 'Faulty MAF sensor', 'Faulty O2 sensor', 'High fuel pressure'] } 
  },
  'P0174': { 
    description: { ar: 'النظام فقير جداً (الضفة 2)', en: 'System Too Lean (Bank 2)' }, 
    causes: { ar: ['تسريب فاكيوم', 'حساس MAF تالف', 'ضغط وقود ضعيف', 'حساس أكسجين تالف'], en: ['Vacuum leak', 'Faulty MAF sensor', 'Low fuel pressure', 'Faulty O2 sensor'] } 
  },
  'P0175': { 
    description: { ar: 'النظام غني جداً (الضفة 2)', en: 'System Too Rich (Bank 2)' }, 
    causes: { ar: ['بخاخ وقود يسرب', 'حساس MAF تالف', 'حساس أكسجين تالف', 'ضغط وقود عالي'], en: ['Leaking fuel injector', 'Faulty MAF sensor', 'Faulty O2 sensor', 'High fuel pressure'] } 
  },

  // P02xx - Fuel and Air Metering (Injector Circuit)
  'P0200': { 
    description: { ar: 'دائرة البخاخ/مفتوحة', en: 'Injector Circuit/Open' }, 
    causes: { ar: ['بخاخ وقود تالف', 'مشكلة في التوصيلات', 'كمبيوتر المحرك (PCM) تالف'], en: ['Faulty fuel injector', 'Wiring issue', 'Faulty PCM'] } 
  },
  'P0201': { 
    description: { ar: 'دائرة البخاخ/مفتوحة - السلندر 1', en: 'Injector Circuit/Open - Cylinder 1' }, 
    causes: { ar: ['بخاخ وقود 1 تالف', 'مشكلة في التوصيلات'], en: ['Faulty fuel injector 1', 'Wiring issue'] } 
  },
  'P0202': { 
    description: { ar: 'دائرة البخاخ/مفتوحة - السلندر 2', en: 'Injector Circuit/Open - Cylinder 2' }, 
    causes: { ar: ['بخاخ وقود 2 تالف', 'مشكلة في التوصيلات'], en: ['Faulty fuel injector 2', 'Wiring issue'] } 
  },
  'P0203': { 
    description: { ar: 'دائرة البخاخ/مفتوحة - السلندر 3', en: 'Injector Circuit/Open - Cylinder 3' }, 
    causes: { ar: ['بخاخ وقود 3 تالف', 'مشكلة في التوصيلات'], en: ['Faulty fuel injector 3', 'Wiring issue'] } 
  },
  'P0204': { 
    description: { ar: 'دائرة البخاخ/مفتوحة - السلندر 4', en: 'Injector Circuit/Open - Cylinder 4' }, 
    causes: { ar: ['بخاخ وقود 4 تالف', 'مشكلة في التوصيلات'], en: ['Faulty fuel injector 4', 'Wiring issue'] } 
  },
  'P0230': { 
    description: { ar: 'الدائرة الأساسية لمضخة الوقود', en: 'Fuel Pump Primary Circuit' }, 
    causes: { ar: ['كتاوت طرمبة البنزين تالف', 'مشكلة في التوصيلات', 'طرمبة البنزين تالفة'], en: ['Faulty fuel pump relay', 'Wiring issue', 'Faulty fuel pump'] } 
  },
  'P0234': { 
    description: { ar: 'حالة ضغط زائد للشاحن التوربيني/السوبر تشارجر', en: 'Turbocharger/Supercharger Overboost Condition' }, 
    causes: { ar: ['بوابة العادم (Wastegate) تالفة', 'حساس الضغط تالف', 'تسريب فاكيوم'], en: ['Faulty wastegate', 'Faulty boost sensor', 'Vacuum leak'] } 
  },
  'P0299': { 
    description: { ar: 'نقص ضغط الشاحن التوربيني/السوبر تشارجر', en: 'Turbocharger/Supercharger Underboost' }, 
    causes: { ar: ['تسريب ضغط', 'تيربو تالف', 'بوابة العادم (Wastegate) تالفة'], en: ['Boost leak', 'Faulty turbocharger', 'Faulty wastegate'] } 
  },

  // P03xx - Ignition System or Misfire
  'P0300': { 
    description: { ar: 'اكتشاف فقد إشعال عشوائي/في عدة أسطوانات', en: 'Random/Multiple Cylinder Misfire Detected' }, 
    causes: { ar: ['بواجي تالفة', 'كويلات تالفة', 'تسريب فاكيوم', 'ضغط وقود ضعيف', 'حساس MAF تالف'], en: ['Faulty spark plugs', 'Faulty ignition coils', 'Vacuum leak', 'Low fuel pressure', 'Faulty MAF sensor'] } 
  },
  'P0301': { 
    description: { ar: 'اكتشاف فقد إشعال في السلندر 1', en: 'Cylinder 1 Misfire Detected' }, 
    causes: { ar: ['بوجي 1 تالف', 'كويل 1 تالف', 'بخاخ 1 تالف', 'ضغط مكينة ضعيف'], en: ['Faulty spark plug 1', 'Faulty ignition coil 1', 'Faulty fuel injector 1', 'Low compression'] } 
  },
  'P0302': { 
    description: { ar: 'اكتشاف فقد إشعال في السلندر 2', en: 'Cylinder 2 Misfire Detected' }, 
    causes: { ar: ['بوجي 2 تالف', 'كويل 2 تالف', 'بخاخ 2 تالف', 'ضغط مكينة ضعيف'], en: ['Faulty spark plug 2', 'Faulty ignition coil 2', 'Faulty fuel injector 2', 'Low compression'] } 
  },
  'P0303': { 
    description: { ar: 'اكتشاف فقد إشعال في السلندر 3', en: 'Cylinder 3 Misfire Detected' }, 
    causes: { ar: ['بوجي 3 تالف', 'كويل 3 تالف', 'بخاخ 3 تالف', 'ضغط مكينة ضعيف'], en: ['Faulty spark plug 3', 'Faulty ignition coil 3', 'Faulty fuel injector 3', 'Low compression'] } 
  },
  'P0304': { 
    description: { ar: 'اكتشاف فقد إشعال في السلندر 4', en: 'Cylinder 4 Misfire Detected' }, 
    causes: { ar: ['بوجي 4 تالف', 'كويل 4 تالف', 'بخاخ 4 تالف', 'ضغط مكينة ضعيف'], en: ['Faulty spark plug 4', 'Faulty ignition coil 4', 'Faulty fuel injector 4', 'Low compression'] } 
  },
  'P0325': { 
    description: { ar: 'دائرة حساس الصرقعة (Knock) 1 (الضفة 1 أو حساس مفرد)', en: 'Knock Sensor 1 Circuit (Bank 1 or Single Sensor)' }, 
    causes: { ar: ['حساس صرقعة تالف', 'مشكلة في التوصيلات', 'صرقعة/تصفيق في المحرك'], en: ['Faulty knock sensor', 'Wiring issue', 'Engine knock/detonation'] } 
  },
  'P0335': { 
    description: { ar: 'دائرة حساس موضع عمود الكرنك "A"', en: 'Crankshaft Position Sensor "A" Circuit' }, 
    causes: { ar: ['حساس كرنك تالف', 'مشكلة في التوصيلات', 'مشكلة في التوقيت'], en: ['Faulty crankshaft position sensor', 'Wiring issue', 'Timing issue'] } 
  },
  'P0340': { 
    description: { ar: 'دائرة حساس موضع عمود الكامات "A"', en: 'Camshaft Position Sensor "A" Circuit' }, 
    causes: { ar: ['حساس كامات تالف', 'مشكلة في التوصيلات', 'مشكلة في التوقيت'], en: ['Faulty camshaft position sensor', 'Wiring issue', 'Timing issue'] } 
  },

  // P04xx - Auxiliary Emission Controls
  'P0400': { 
    description: { ar: 'تدفق إعادة تدوير غاز العادم (EGR)', en: 'Exhaust Gas Recirculation Flow' }, 
    causes: { ar: ['بلف EGR تالف', 'مجاري EGR مسدودة', 'تسريب فاكيوم'], en: ['Faulty EGR valve', 'Clogged EGR passages', 'Vacuum leak'] } 
  },
  'P0401': { 
    description: { ar: 'اكتشاف تدفق غير كافٍ لإعادة تدوير غاز العادم (EGR)', en: 'Exhaust Gas Recirculation Flow Insufficient Detected' }, 
    causes: { ar: ['مجاري EGR مسدودة', 'بلف EGR تالف'], en: ['Clogged EGR passages', 'Faulty EGR valve'] } 
  },
  'P0402': { 
    description: { ar: 'اكتشاف تدفق زائد لإعادة تدوير غاز العادم (EGR)', en: 'Exhaust Gas Recirculation Flow Excessive Detected' }, 
    causes: { ar: ['بلف EGR تالف', 'بلف EGR عالق مفتوح'], en: ['Faulty EGR valve', 'EGR valve stuck open'] } 
  },
  'P0420': { 
    description: { ar: 'كفاءة نظام المحول الحفاز (دبة التلوث) دون الحد المطلوب (الضفة 1)', en: 'Catalyst System Efficiency Below Threshold (Bank 1)' }, 
    causes: { ar: ['دبة تلوث تالفة', 'حساس أكسجين تالف', 'تسريب في العادم'], en: ['Faulty catalytic converter', 'Faulty O2 sensor', 'Exhaust leak'] } 
  },
  'P0430': { 
    description: { ar: 'كفاءة نظام المحول الحفاز (دبة التلوث) دون الحد المطلوب (الضفة 2)', en: 'Catalyst System Efficiency Below Threshold (Bank 2)' }, 
    causes: { ar: ['دبة تلوث تالفة', 'حساس أكسجين تالف', 'تسريب في العادم'], en: ['Faulty catalytic converter', 'Faulty O2 sensor', 'Exhaust leak'] } 
  },
  'P0440': { 
    description: { ar: 'نظام الانبعاثات التبخيرية (EVAP)', en: 'Evaporative Emission System' }, 
    causes: { ar: ['غطاء البنزين غير محكم', 'بلف التبخير تالف', 'تسريب في نظام EVAP'], en: ['Loose gas cap', 'Faulty purge valve', 'EVAP leak'] } 
  },
  'P0441': { 
    description: { ar: 'تدفق تطهير غير صحيح في نظام الانبعاثات التبخيرية', en: 'Evaporative Emission System Incorrect Purge Flow' }, 
    causes: { ar: ['بلف التبخير تالف', 'علبة الفحم (كانستر) مسدودة'], en: ['Faulty purge valve', 'Clogged EVAP canister'] } 
  },
  'P0442': { 
    description: { ar: 'اكتشاف تسريب في نظام الانبعاثات التبخيرية (تسريب صغير)', en: 'Evaporative Emission System Leak Detected (small leak)' }, 
    causes: { ar: ['غطاء البنزين غير محكم', 'تسريب صغير في نظام EVAP', 'بلف التبخير تالف'], en: ['Loose gas cap', 'Small EVAP leak', 'Faulty purge valve'] } 
  },
  'P0455': { 
    description: { ar: 'اكتشاف تسريب في نظام الانبعاثات التبخيرية (تسريب كبير)', en: 'Evaporative Emission System Leak Detected (large leak)' }, 
    causes: { ar: ['غطاء البنزين مفقود/غير محكم', 'تسريب كبير في نظام EVAP', 'هوز EVAP مفصول'], en: ['Missing/loose gas cap', 'Large EVAP leak', 'Disconnected EVAP hose'] } 
  },
  'P0460': { 
    description: { ar: 'دائرة حساس مستوى الوقود "A"', en: 'Fuel Level Sensor "A" Circuit' }, 
    causes: { ar: ['عوامة البنزين تالفة', 'مشكلة في التوصيلات'], en: ['Faulty fuel level sensor', 'Wiring issue'] } 
  },

  // P05xx - Vehicle Speed, Idle Control, and Auxiliary Inputs
  'P0500': { 
    description: { ar: 'دائرة حساس سرعة المركبة "A"', en: 'Vehicle Speed Sensor "A" Circuit' }, 
    causes: { ar: ['حساس سرعة (VSS) تالف', 'مشكلة في التوصيلات', 'مشكلة في طبلون العدادات'], en: ['Faulty VSS', 'Wiring issue', 'Faulty instrument cluster'] } 
  },
  'P0505': { 
    description: { ar: 'نظام التحكم في هواء السلانسيه (الخمول)', en: 'Idle Air Control System' }, 
    causes: { ar: ['بلف الهواء (IAC) تالف', 'تسريب فاكيوم', 'بوابة الهواء (الثروتل) متسخة'], en: ['Faulty IAC valve', 'Vacuum leak', 'Dirty throttle body'] } 
  },
  'P0507': { 
    description: { ar: 'سرعة دوران المحرك (RPM) لنظام التحكم في السلانسيه أعلى من المتوقع', en: 'Idle Air Control System RPM Higher Than Expected' }, 
    causes: { ar: ['تسريب فاكيوم', 'بلف الهواء (IAC) تالف', 'بوابة الهواء (الثروتل) متسخة'], en: ['Vacuum leak', 'Faulty IAC valve', 'Dirty throttle body'] } 
  },
  'P0520': { 
    description: { ar: 'دائرة حساس/مفتاح ضغط زيت المحرك', en: 'Engine Oil Pressure Sensor/Switch Circuit' }, 
    causes: { ar: ['حساس ضغط الزيت تالف', 'ضغط الزيت منخفض', 'مشكلة في التوصيلات'], en: ['Faulty oil pressure sensor', 'Low oil pressure', 'Wiring issue'] } 
  },

  // P06xx - Computer and Output Circuits
  'P0601': { 
    description: { ar: 'خطأ في المجموع الاختباري لذاكرة وحدة التحكم الداخلية', en: 'Internal Control Module Memory Check Sum Error' }, 
    causes: { ar: ['كمبيوتر المحرك (PCM/ECM) تالف', 'خطأ في البرمجة'], en: ['Faulty PCM/ECM', 'Programming error'] } 
  },
  'P0603': { 
    description: { ar: 'خطأ في ذاكرة الاحتفاظ بالبيانات (KAM) لوحدة التحكم الداخلية', en: 'Internal Control Module Keep Alive Memory (KAM) Error' }, 
    causes: { ar: ['البطارية مفصولة', 'كمبيوتر المحرك (PCM/ECM) تالف', 'جهد البطارية منخفض'], en: ['Battery disconnected', 'Faulty PCM/ECM', 'Low battery voltage'] } 
  },
  'P0606': { 
    description: { ar: 'معالج ECM/PCM', en: 'ECM/PCM Processor' }, 
    causes: { ar: ['كمبيوتر المحرك (PCM/ECM) تالف'], en: ['Faulty PCM/ECM'] } 
  },

  // P07xx - Transmission
  'P0700': { 
    description: { ar: 'نظام التحكم في ناقل الحركة (طلب إضاءة لمبة المكينة)', en: 'Transmission Control System (MIL Request)' }, 
    causes: { ar: ['كمبيوتر القير (TCM) تالف', 'مشكلة في القير (افحص أكواد TCM)'], en: ['Faulty TCM', 'Transmission issue (check TCM codes)'] } 
  },
  'P0705': { 
    description: { ar: 'عطل في دائرة حساس نطاق ناقل الحركة (إدخال PRNDL)', en: 'Transmission Range Sensor Circuit Malfunction (PRNDL Input)' }, 
    causes: { ar: ['مفتاح الأمان المحايد تالف', 'مشكلة في التوصيلات'], en: ['Faulty neutral safety switch', 'Wiring issue'] } 
  },
  'P0715': { 
    description: { ar: 'دائرة حساس سرعة الإدخال/التوربين "A"', en: 'Input/Turbine Speed Sensor "A" Circuit' }, 
    causes: { ar: ['حساس سرعة الإدخال تالف', 'مشكلة في التوصيلات', 'مشكلة في زيت القير'], en: ['Faulty input speed sensor', 'Wiring issue', 'Transmission fluid issue'] } 
  },
  'P0720': { 
    description: { ar: 'دائرة حساس سرعة الإخراج', en: 'Output Speed Sensor Circuit' }, 
    causes: { ar: ['حساس سرعة الإخراج تالف', 'مشكلة في التوصيلات'], en: ['Faulty output speed sensor', 'Wiring issue'] } 
  },
  'P0730': { 
    description: { ar: 'نسبة التروس غير صحيحة', en: 'Incorrect Gear Ratio' }, 
    causes: { ar: ['زيت القير ناقص', 'بلف تعشيق (Solenoid) تالف', 'عطل داخلي في القير'], en: ['Low transmission fluid', 'Faulty shift solenoid', 'Internal transmission failure'] } 
  },
  'P0740': { 
    description: { ar: 'عطل في دائرة قابض محول عزم الدوران (الطنجرة)', en: 'Torque Converter Clutch Circuit Malfunction' }, 
    causes: { ar: ['بلف TCC تالف', 'مشكلة في التوصيلات', 'طنجرة القير تالفة'], en: ['Faulty TCC solenoid', 'Wiring issue', 'Faulty torque converter'] } 
  },

  // P1xxx - Manufacturer Specific (Common Examples)
  'P1135': {
    description: { ar: 'دائرة استجابة سخان حساس الأكسجين (تويوتا)', en: 'Air/Fuel Sensor Heater Circuit Response (Toyota)' },
    causes: { ar: ['سخان حساس الأكسجين تالف', 'مشكلة في التوصيلات'], en: ['Faulty A/F sensor heater', 'Wiring issue'] }
  },
  'P1349': {
    description: { ar: 'نظام VVT (تويوتا)', en: 'VVT System Malfunction (Toyota)' },
    causes: { ar: ['حساس VVT متسخ/تالف', 'زيت محرك متسخ', 'ضغط زيت ضعيف'], en: ['Dirty/Faulty VVT sensor', 'Dirty engine oil', 'Low oil pressure'] }
  },
  'P1456': {
    description: { ar: 'تسريب في نظام EVAP - خزان الوقود (هوندا)', en: 'EVAP Emission Control System Leak Detected - Fuel Tank System (Honda)' },
    causes: { ar: ['غطاء البنزين غير محكم', 'تسريب في خزان الوقود'], en: ['Loose gas cap', 'Fuel tank leak'] }
  },
  'P1457': {
    description: { ar: 'تسريب في نظام EVAP - علبة الفحم (هوندا)', en: 'EVAP Emission Control System Leak Detected - Control Box System (Honda)' },
    causes: { ar: ['علبة الفحم (كانستر) تالفة/تسرب', 'بلف التبخير تالف'], en: ['Faulty/Leaking EVAP canister', 'Faulty purge valve'] }
  },
  'P1299': {
    description: { ar: 'حماية المحرك من الحرارة الزائدة نشطة (فورد)', en: 'Cylinder Head Overtemperature Protection Active (Ford)' },
    causes: { ar: ['ارتفاع شديد في حرارة المحرك', 'نقص ماء الرديتر', 'طرمبة ماء تالفة'], en: ['Severe engine overheating', 'Low coolant', 'Faulty water pump'] }
  },

  // U-Codes - Network
  'U0001': { 
    description: { ar: 'ناقل اتصالات CAN عالي السرعة', en: 'High Speed CAN Communication Bus' }, 
    causes: { ar: ['مشكلة في توصيلات شبكة CAN', 'وحدة تحكم تالفة على الشبكة'], en: ['Wiring issue on CAN bus', 'Faulty module on network'] } 
  },
  'U0100': { 
    description: { ar: 'فقدان الاتصال مع ECM/PCM "A"', en: 'Lost Communication With ECM/PCM "A"' }, 
    causes: { ar: ['كمبيوتر المحرك (PCM) تالف', 'مشكلة في التوصيلات', 'فيوز محترق'], en: ['Faulty PCM', 'Wiring issue', 'Blown fuse'] } 
  },
  'U0101': { 
    description: { ar: 'فقدان الاتصال مع TCM', en: 'Lost Communication with TCM' }, 
    causes: { ar: ['كمبيوتر القير (TCM) تالف', 'مشكلة في التوصيلات', 'فيوز محترق'], en: ['Faulty TCM', 'Wiring issue', 'Blown fuse'] } 
  },
};

export function getDTCInfo(code: string, lang: 'ar' | 'en' = 'en') {
  const entry = DTC_DATABASE[code];
  if (entry) {
    return {
      description: entry.description[lang],
      causes: entry.causes[lang]
    };
  }

  // Fallback logic for unknown codes
  const prefix = code.substring(0, 2);
  let fallbackDesc = { ar: 'عطل غير معروف', en: 'Unknown Fault' };
  
  if (code.startsWith('P0')) fallbackDesc = { ar: 'عطل عام في نظام نقل الحركة (المحرك/القير)', en: 'Generic Powertrain Fault' };
  else if (code.startsWith('P1')) fallbackDesc = { ar: 'عطل خاص بالشركة المصنعة في نظام نقل الحركة', en: 'Manufacturer Specific Powertrain Fault' };
  else if (code.startsWith('P2') || code.startsWith('P3')) fallbackDesc = { ar: 'عطل في نظام نقل الحركة', en: 'Powertrain Fault' };
  else if (code.startsWith('B0')) fallbackDesc = { ar: 'عطل عام في هيكل السيارة (Body)', en: 'Generic Body Fault' };
  else if (code.startsWith('B1') || code.startsWith('B2')) fallbackDesc = { ar: 'عطل خاص بالشركة المصنعة في هيكل السيارة', en: 'Manufacturer Specific Body Fault' };
  else if (code.startsWith('C0')) fallbackDesc = { ar: 'عطل عام في الشاسيه (ABS/Traction)', en: 'Generic Chassis Fault' };
  else if (code.startsWith('C1') || code.startsWith('C2')) fallbackDesc = { ar: 'عطل خاص بالشركة المصنعة في الشاسيه', en: 'Manufacturer Specific Chassis Fault' };
  else if (code.startsWith('U0')) fallbackDesc = { ar: 'عطل عام في شبكة الاتصالات (CAN)', en: 'Generic Network Fault' };
  else if (code.startsWith('U1') || code.startsWith('U2')) fallbackDesc = { ar: 'عطل خاص بالشركة المصنعة في شبكة الاتصالات', en: 'Manufacturer Specific Network Fault' };

  return {
    description: `${fallbackDesc[lang]} (${code})`,
    causes: lang === 'ar' ? ['يرجى الرجوع إلى دليل صيانة السيارة المحدد'] : ['Please refer to the specific vehicle service manual']
  };
}
