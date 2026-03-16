import React, { useState, useEffect } from 'react';
import { useCarStore } from '../store/carStore';
import { USBConnection } from '../lib/obd/usb';
import { BLEConnection } from '../lib/obd/bluetooth';
import { WiFiConnection } from '../lib/obd/wifi';
import { DemoConnection } from '../lib/obd/demo';
import { ELM327 } from '../lib/obd/elm327';
import { Usb, Bluetooth, Wifi, LogOut, Loader2, PlayCircle, Bell, Globe } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export function Settings() {
  const { isConnected, connectionType, connect, disconnect, smartAlertsEnabled, toggleSmartAlerts } = useCarStore();
  const { t, uiLang, termLang, setUiLang, setTermLang } = useI18n();
  const [loading, setLoading] = useState<'usb' | 'ble' | 'wifi' | 'demo' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wifiIp, setWifiIp] = useState('192.168.0.10:35000');

  const [isSerialSupported, setIsSerialSupported] = useState(true);
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(true);

  useEffect(() => {
    setIsSerialSupported('serial' in navigator);
    setIsBluetoothSupported('bluetooth' in navigator);
  }, []);

  const handleConnect = async (type: 'usb' | 'ble' | 'wifi' | 'demo') => {
    setLoading(type);
    setError(null);
    try {
      let conn;
      if (type === 'usb') conn = new USBConnection();
      else if (type === 'ble') conn = new BLEConnection();
      else if (type === 'demo') conn = new DemoConnection();
      else {
        const cleanIp = wifiIp.replace(/^wss?:\/\//i, '');
        conn = new WiFiConnection(`ws://${cleanIp}`);
      }

      const elm = new ELM327(conn);
      await connect(elm, type);
    } catch (err: any) {
      setError(err.message || 'فشل الاتصال بالجهاز');
    } finally {
      setLoading(null);
    }
  };

  const handleWifiIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWifiIp(val.replace(/^wss?:\/\//i, ''));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h2 className="text-3xl font-bold text-slate-100">الإعدادات والاتصال</h2>
        <p className="text-slate-400 mt-2">اختر طريقة الاتصال بجهاز ELM327 OBD-II</p>
      </header>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      {isConnected ? (
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-2xl p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/20 rounded-full">
              {connectionType === 'usb' && <Usb className="w-8 h-8 text-emerald-400" />}
              {connectionType === 'ble' && <Bluetooth className="w-8 h-8 text-emerald-400" />}
              {connectionType === 'wifi' && <Wifi className="w-8 h-8 text-emerald-400" />}
              {connectionType === 'demo' && <PlayCircle className="w-8 h-8 text-emerald-400" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400">متصل بنجاح</h3>
              <p className="text-emerald-500/80 mt-1">
                جاري استقبال البيانات عبر {connectionType?.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={disconnect}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            قطع الاتصال
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          <ConnectionCard
            title="اتصال USB"
            description={isSerialSupported ? "يتطلب متصفح Chrome/Edge ودعم Web Serial API" : "متصفحك لا يدعم Web Serial API"}
            icon={Usb}
            loading={loading === 'usb'}
            onClick={() => handleConnect('usb')}
            color="indigo"
            disabled={!isSerialSupported}
          />

          <ConnectionCard
            title="اتصال Bluetooth BLE"
            description={isBluetoothSupported ? "يتطلب دعم Web Bluetooth API (أجهزة BLE فقط)" : "متصفحك لا يدعم Web Bluetooth API"}
            icon={Bluetooth}
            loading={loading === 'ble'}
            onClick={() => handleConnect('ble')}
            color="blue"
            disabled={!isBluetoothSupported}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-teal-500/10 rounded-xl">
                <Wifi className="w-8 h-8 text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-200">اتصال WiFi</h3>
                <p className="text-slate-400 mt-1">الاتصال عبر الشبكة المحلية (WebSocket)</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-slate-500" dir="ltr">ws://</span>
                  <input
                    type="text"
                    value={wifiIp}
                    onChange={handleWifiIpChange}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleConnect('wifi')}
              disabled={loading !== null}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors w-full md:w-auto justify-center"
            >
              {loading === 'wifi' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'اتصال'}
            </button>
          </div>

          <ConnectionCard
            title="وضع المحاكاة (Demo Mode)"
            description="تجربة التطبيق ببيانات افتراضية بدون الاتصال بسيارة فعلية"
            icon={PlayCircle}
            loading={loading === 'demo'}
            onClick={() => handleConnect('demo')}
            color="emerald"
          />
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              {t('app_language')}
            </h3>
            <p className="text-slate-400 mt-1">{uiLang === 'ar' ? 'اختر لغة واجهة التطبيق' : 'Choose application interface language'}</p>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setUiLang('ar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${uiLang === 'ar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('arabic')}
            </button>
            <button 
              onClick={() => setUiLang('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${uiLang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('english')}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-400" />
              {t('term_language')}
            </h3>
            <p className="text-slate-400 mt-1">{uiLang === 'ar' ? 'اختر لغة المصطلحات الفنية (الأعطال، الحساسات)' : 'Choose technical terminology language (DTCs, Sensors)'}</p>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setTermLang('ar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${termLang === 'ar' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('arabic')}
            </button>
            <button 
              onClick={() => setTermLang('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${termLang === 'en' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('english')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              {t('smart_alerts')}
            </h3>
            <p className="text-slate-400 mt-1">{t('smart_alerts_desc')}</p>
          </div>
          <button
            onClick={toggleSmartAlerts}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${smartAlertsEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smartAlertsEnabled ? (uiLang === 'ar' ? '-translate-x-6' : 'translate-x-6') : (uiLang === 'ar' ? '-translate-x-1' : 'translate-x-1')}`} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold text-slate-100 mb-4">واجهة برمجة التطبيقات (API)</h3>
        <p className="text-slate-400 mb-4">
          يمكنك الوصول إلى بيانات السيارة من تطبيقات أخرى عبر الروابط التالية:
        </p>
        <div className="space-y-2 font-mono text-sm" dir="ltr">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-indigo-400">GET /api/car/snapshot</div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-indigo-400">GET /api/car/speed</div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-indigo-400">GET /api/car/rpm</div>
        </div>
      </div>
    </div>
  );
}

function ConnectionCard({ title, description, icon: Icon, loading, onClick, color, disabled = false }: { title: string, description: string, icon: any, loading: boolean, onClick: () => void, color: 'indigo' | 'blue' | 'emerald', disabled?: boolean }) {
  const colorMap = {
    indigo: {
      iconBg: 'bg-indigo-500/10',
      iconText: 'text-indigo-400',
      border: 'border-indigo-500/20 hover:border-indigo-500/50',
      btn: 'bg-indigo-600 hover:bg-indigo-500'
    },
    blue: {
      iconBg: 'bg-blue-500/10',
      iconText: 'text-blue-400',
      border: 'border-blue-500/20 hover:border-blue-500/50',
      btn: 'bg-blue-600 hover:bg-blue-500'
    },
    emerald: {
      iconBg: 'bg-emerald-500/10',
      iconText: 'text-emerald-400',
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      btn: 'bg-emerald-600 hover:bg-emerald-500'
    }
  };

  const theme = colorMap[color];

  return (
    <div className={`bg-slate-900 border ${theme.border} rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors`}>
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${theme.iconBg}`}>
          <Icon className={`w-8 h-8 ${theme.iconText}`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-200">{title}</h3>
          <p className="text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`flex items-center gap-2 px-6 py-3 ${theme.btn} disabled:opacity-50 text-white rounded-xl font-medium transition-colors w-full md:w-auto justify-center`}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'اتصال'}
      </button>
    </div>
  );
}
