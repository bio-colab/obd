import React, { useState } from 'react';
import { useCarStore } from '../store/carStore';
import { DTC_DATABASE } from '../lib/obd/dtcDatabase';
import { AlertTriangle, CheckCircle, Trash2, RefreshCw, Car, ShieldCheck, BrainCircuit, Loader2, Info } from 'lucide-react';
import { motion } from 'motion/react';

export function Diagnostics() {
  const { dtcs, readDTCs, clearDTCs, isConnected, vin, readiness, analyzeFaults, aiDiagnosis, isAnalyzing } = useCarStore();
  const [loading, setLoading] = useState(false);

  const handleRead = async () => {
    setLoading(true);
    await readDTCs();
    setLoading(false);
  };

  const handleClear = async () => {
    if (window.confirm('هل أنت متأكد من مسح جميع الأعطال؟')) {
      setLoading(true);
      await clearDTCs();
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">تشخيص الأعطال (DTC)</h2>
          <p className="text-slate-400 mt-2">قراءة وتفسير رموز أعطال المحرك</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRead}
            disabled={!isConnected || loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            فحص الأعطال
          </button>
          <button
            onClick={handleClear}
            disabled={!isConnected || loading || dtcs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            مسح الأعطال
          </button>
        </div>
      </header>

      {/* Vehicle Info & Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-slate-200">معلومات المركبة</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400 text-sm">رقم الهيكل (VIN)</span>
              <span className="text-slate-200 font-mono font-medium">{vin || 'غير متوفر'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400 text-sm">حالة الاتصال</span>
              <span className={`font-medium ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isConnected ? 'متصل' : 'غير متصل'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-slate-200">جاهزية الانبعاثات (I/M Readiness)</h3>
          </div>
          {!readiness ? (
            <p className="text-slate-500 text-center py-4">البيانات غير متوفرة</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <ReadinessItem label="Misfire" ready={readiness.misfire} />
              <ReadinessItem label="Fuel System" ready={readiness.fuelSystem} />
              <ReadinessItem label="Components" ready={readiness.components} />
              <ReadinessItem label="Catalyst" ready={readiness.catalyst} />
              <ReadinessItem label="Evap System" ready={readiness.evap} />
              <ReadinessItem label="O2 Sensor" ready={readiness.o2Sensor} />
              <ReadinessItem label="O2 Heater" ready={readiness.o2Heater} />
              <ReadinessItem label="EGR System" ready={readiness.egr} />
            </div>
          )}
        </div>
      </div>

      {/* DTC List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-200 mb-4">رموز الأعطال المسجلة</h3>
        {!isConnected ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-200">السيارة غير متصلة</h3>
            <p className="text-slate-400 mt-2">الرجاء الاتصال بجهاز OBD أولاً لقراءة الأعطال.</p>
          </div>
        ) : dtcs.length === 0 ? (
          <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-200">لا توجد أعطال</h3>
            <p className="text-slate-400 mt-2">نظام المحرك يعمل بشكل سليم.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {dtcs.map((code, index) => {
              const dbEntry = DTC_DATABASE[code];
              return (
                <div key={index} className="bg-slate-900 border border-rose-900/50 rounded-2xl p-6 flex items-start gap-4">
                  <div className="p-3 bg-rose-500/10 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-mono text-rose-400">{code}</h3>
                    <p className="text-slate-300 mt-1 text-lg">
                      {dbEntry ? dbEntry.description : 'عطل غير معروف في قاعدة البيانات (Generic Code)'}
                    </p>
                    {dbEntry && dbEntry.causes && (
                      <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">الأسباب المحتملة:</span>
                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                          {dbEntry.causes.map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs font-medium">المحرك</span>
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs font-medium">عطل حالي</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Diagnostics Trigger */}
            <div className="pt-4 mt-6">
              <button
                onClick={analyzeFaults}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl transition-all font-bold text-lg shadow-lg shadow-purple-900/20"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <BrainCircuit className="w-6 h-6" />
                )}
                التحليل الذكي للأعطال (AI Root Cause Analysis)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Analysis Results */}
      {aiDiagnosis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-900/20 mt-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BrainCircuit className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">تقرير الذكاء الاصطناعي</h3>
              <p className="text-purple-300/70 text-sm mt-1">تحليل متقدم للسبب الجذري للأعطال</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Root Causes */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
                <h4 className="text-rose-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  الأسباب الجذرية (Root Causes)
                </h4>
                <ul className="space-y-3">
                  {aiDiagnosis.rootCauses.map((cause, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span className="leading-relaxed">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Symptoms */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                <h4 className="text-amber-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  الأعراض الجانبية (Symptoms)
                </h4>
                <ul className="space-y-3">
                  {aiDiagnosis.symptoms.map((sym, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="leading-relaxed">{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="text-indigo-400 font-bold text-lg mb-3">التفسير الفني (Technical Explanation)</h4>
              <p className="text-slate-300 leading-relaxed text-lg">{aiDiagnosis.explanation}</p>
            </div>

            {/* Recommended Actions */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <h4 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                خطوات الإصلاح المقترحة
              </h4>
              <div className="space-y-4">
                {aiDiagnosis.recommendedActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-1">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ReadinessItem({ label, ready }: { label: string, ready: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-400">{label}</span>
      {ready ? (
        <span className="text-emerald-400 font-medium">Ready</span>
      ) : (
        <span className="text-rose-400 font-medium">Not Ready</span>
      )}
    </div>
  );
}
