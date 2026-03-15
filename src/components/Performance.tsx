import React, { useEffect, useState } from 'react';
import { useCarStore } from '../store/carStore';
import { db, DriverEvent } from '../lib/db';
import { Activity, ShieldAlert, Timer, TrendingUp } from 'lucide-react';

export function Performance() {
  const { driverScore, sessionId, liveData } = useCarStore();
  const [events, setEvents] = useState<DriverEvent[]>([]);
  const [accel0to100, setAccel0to100] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Load events for current session
      db.events.where('sessionId').equals(sessionId).toArray().then(setEvents);
      
      // Calculate 0-100 (Feature D)
      db.readings.where('sessionId').equals(sessionId).toArray().then(readings => {
        const start = readings.find(r => r.speed >= 5 && r.speed <= 15);
        if (start) {
          const end = readings.find(r => r.speed >= 100 && r.timestamp > start.timestamp);
          if (end) {
            setAccel0to100(((end.timestamp - start.timestamp) / 1000).toFixed(2) + ' ثانية');
          }
        }
      });
    }
  }, [sessionId, driverScore]); // Re-run when score changes (new event)

  // Calculate dynamic engine performance based on live data
  const getEnginePerformance = () => {
    if (!liveData.RPM || !liveData.LOAD) return 'غير متوفر';
    if (liveData.LOAD > 80 && liveData.RPM < 2000) return 'إجهاد (Lugging)';
    if (liveData.LOAD > 90) return 'حمل أقصى';
    if (liveData.LOAD < 30) return 'حمل خفيف';
    return 'طبيعي / ممتاز';
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-100">تحليل الأداء وسلوك السائق</h2>
        <p className="text-slate-400 mt-2">مؤشرات الأداء المتقدمة وتقييم القيادة</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-indigo-500/10 rounded-full mb-4">
            <ShieldAlert className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-300">تقييم السائق</h3>
          <div className="text-5xl font-bold text-emerald-400 mt-2">{driverScore}%</div>
          <p className="text-sm text-slate-500 mt-2">يعتمد على التسارع والفرملة</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-rose-500/10 rounded-full mb-4">
            <Timer className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-300">تسارع 0-100 كم/س</h3>
          <div className="text-4xl font-bold text-slate-100 mt-2 font-mono">
            {accel0to100 || '--'}
          </div>
          <p className="text-sm text-slate-500 mt-2">أفضل رقم في هذه الرحلة</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-amber-500/10 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-300">أداء المحرك تحت الحمل</h3>
          <div className="text-3xl font-bold text-slate-100 mt-2 font-mono">{getEnginePerformance()}</div>
          <p className="text-sm text-slate-500 mt-2">بناءً على قراءات Load و RPM</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-6">سجل الأحداث (الرحلة الحالية)</h3>
        {events.length === 0 ? (
          <p className="text-slate-400 text-center py-8">لا توجد أحداث مسجلة حتى الآن.</p>
        ) : (
          <div className="space-y-4">
            {events.map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${ev.type === 'hard_accel' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">
                      {ev.type === 'hard_accel' ? 'تسارع مفاجئ' : ev.type === 'hard_brake' ? 'فرملة قوية' : 'سرعة زائدة'}
                    </h4>
                    <p className="text-sm text-slate-400">{new Date(ev.timestamp).toLocaleTimeString('ar-SA')}</p>
                  </div>
                </div>
                <div className="text-rose-400 font-medium font-mono">
                  -2 نقطة
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
