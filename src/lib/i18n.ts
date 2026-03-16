import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    dashboard: 'لوحة القيادة',
    diagnostics: 'التشخيص',
    terminal: 'الطرفية',
    settings: 'الإعدادات',
    app_language: 'لغة واجهة التطبيق',
    term_language: 'لغة المصطلحات الفنية',
    arabic: 'العربية',
    english: 'English',
    smart_alerts: 'التنبيهات الذكية',
    smart_alerts_desc: 'تنبيه عند ارتفاع الحرارة أو انخفاض البطارية',
    read_faults: 'قراءة الأعطال',
    clear_faults: 'مسح الأعطال',
    ai_analysis: 'تحليل الذكاء الاصطناعي',
    analyzing: 'جاري التحليل...',
    no_faults: 'لا توجد أعطال مسجلة',
    root_causes: 'الأسباب الجذرية المحتملة',
    symptoms: 'الأعراض الجانبية',
    explanation: 'التفسير والارتباط',
    recommended_actions: 'خطوات الإصلاح الموصى بها',
    connection_status: 'حالة الاتصال',
    connected: 'متصل',
    disconnected: 'غير متصل',
    live_sensors: 'الحساسات الحية',
    live_chart: 'رسم بياني مباشر',
    demo_mode: 'وضع المحاكاة (Demo)',
    usb_serial: 'كابل USB (Serial)',
    bluetooth: 'بلوتوث (BLE)',
    wifi: 'واي فاي (WiFi)',
    connect: 'اتصال',
    disconnect: 'فصل الاتصال',
    not_supported: 'غير مدعوم في المتصفح',
    connection_methods: 'طرق الاتصال',
    app_settings: 'إعدادات التطبيق',
    obd_terminal: 'موجه أوامر OBD-II',
    send: 'إرسال',
    type_command: 'اكتب الأمر (مثال: 010C)...',
    clear: 'مسح',
    speed: 'السرعة',
    time: 'الوقت',
  },
  en: {
    dashboard: 'Dashboard',
    diagnostics: 'Diagnostics',
    terminal: 'Terminal',
    settings: 'Settings',
    app_language: 'App Language',
    term_language: 'Terminology Language',
    arabic: 'العربية',
    english: 'English',
    smart_alerts: 'Smart Alerts',
    smart_alerts_desc: 'Alert on high temp or low battery',
    read_faults: 'Read Faults',
    clear_faults: 'Clear Faults',
    ai_analysis: 'AI Analysis',
    analyzing: 'Analyzing...',
    no_faults: 'No faults recorded',
    root_causes: 'Potential Root Causes',
    symptoms: 'Symptoms',
    explanation: 'Explanation & Correlation',
    recommended_actions: 'Recommended Actions',
    connection_status: 'Connection Status',
    connected: 'Connected',
    disconnected: 'Disconnected',
    live_sensors: 'Live Sensors',
    live_chart: 'Live Chart',
    demo_mode: 'Demo Mode',
    usb_serial: 'USB Cable (Serial)',
    bluetooth: 'Bluetooth (BLE)',
    wifi: 'WiFi',
    connect: 'Connect',
    disconnect: 'Disconnect',
    not_supported: 'Not supported in browser',
    connection_methods: 'Connection Methods',
    app_settings: 'App Settings',
    obd_terminal: 'OBD-II Terminal',
    send: 'Send',
    type_command: 'Type command (e.g., 010C)...',
    clear: 'Clear',
    speed: 'Speed',
    time: 'Time',
  }
};

interface I18nState {
  uiLang: Language;
  termLang: Language;
  setUiLang: (lang: Language) => void;
  setTermLang: (lang: Language) => void;
  t: (key: keyof typeof translations['ar'], params?: Record<string, string>) => string;
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      uiLang: 'ar',
      termLang: 'en',
      setUiLang: (lang) => {
        set({ uiLang: lang });
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      },
      setTermLang: (lang) => {
        set({ termLang: lang });
      },
      t: (key, params) => {
        const { uiLang } = get();
        let text = translations[uiLang][key] || key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, v);
          });
        }
        return text;
      }
    }),
    { name: 'i18n-storage' }
  )
);
