import React, { useState } from 'react';
import { useCarStore } from '../store/carStore';
import { DTC_DATABASE } from '../lib/obd/dtcDatabase';
import { AlertTriangle, CheckCircle, Trash2, RefreshCw, Car, ShieldCheck, BrainCircuit, Loader2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';

export function Diagnostics() {
  const { dtcs, readDTCs, clearDTCs, isConnected, vin, readiness, analyzeFaults, aiDiagnosis, isAnalyzing } = useCarStore();
  const { t, uiLang, termLang } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleRead = async () => {
    setLoading(true);
    await readDTCs();
    setLoading(false);
  };

  const handleClear = async () => {
    if (window.confirm(uiLang === 'ar' ? 'هل أنت متأكد من مسح جميع الأعطال؟' : 'Are you sure you want to clear all DTCs?')) {
      setLoading(true);
      await clearDTCs();
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">{t('diagnostics')}</h2>
          <p className="text-slate-400 mt-2">{uiLang === 'ar' ? 'قراءة وتفسير رموز أعطال المحرك' : 'Read and interpret engine fault codes'}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRead}
            disabled={!isConnected || loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {uiLang === 'ar' ? 'فحص الأعطال' : 'Scan DTCs'}
          </button>
          <button
            onClick={handleClear}
            disabled={!isConnected || loading || dtcs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {uiLang === 'ar' ? 'مسح الأعطال' : 'Clear DTCs'}
          </button>
        </div>
      </header>

      {/* Vehicle Info & Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-slate-200">{uiLang === 'ar' ? 'معلومات المركبة' : 'Vehicle Information'}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400 text-sm">{uiLang === 'ar' ? 'رقم الهيكل (VIN)' : 'VIN'}</span>
              <span className="text-slate-200 font-mono font-medium">{vin || (uiLang === 'ar' ? 'غير متوفر' : 'N/A')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400 text-sm">{t('connection_status')}</span>
              <span className={`font-medium ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isConnected ? t('connected') : t('disconnected')}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-slate-200">{uiLang === 'ar' ? 'جاهزية الانبعاثات (I/M Readiness)' : 'I/M Readiness'}</h3>
          </div>
          {!readiness ? (
            <p className="text-slate-500 text-center py-4">{uiLang === 'ar' ? 'البيانات غير متوفرة' : 'Data not available'}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <ReadinessItem label="Misfire" ready={readiness.misfire} uiLang={uiLang} />
              <ReadinessItem label="Fuel System" ready={readiness.fuelSystem} uiLang={uiLang} />
              <ReadinessItem label="Components" ready={readiness.components} uiLang={uiLang} />
              <ReadinessItem label="Catalyst" ready={readiness.catalyst} uiLang={uiLang} />
              <ReadinessItem label="Evap System" ready={readiness.evap} uiLang={uiLang} />
              <ReadinessItem label="O2 Sensor" ready={readiness.o2Sensor} uiLang={uiLang} />
              <ReadinessItem label="O2 Heater" ready={readiness.o2Heater} uiLang={uiLang} />
              <ReadinessItem label="EGR System" ready={readiness.egr} uiLang={uiLang} />
            </div>
          )}
        </div>
      </div>

      {/* DTC List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-200 mb-4">{uiLang === 'ar' ? 'رموز الأعطال المسجلة' : 'Stored Fault Codes'}</h3>
        {!isConnected ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-200">{uiLang === 'ar' ? 'السيارة غير متصلة' : 'Vehicle Disconnected'}</h3>
            <p className="text-slate-400 mt-2">{uiLang === 'ar' ? 'الرجاء الاتصال بجهاز OBD أولاً لقراءة الأعطال.' : 'Please connect to an OBD device first to read faults.'}</p>
          </div>
        ) : dtcs.length === 0 ? (
          <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-200">{uiLang === 'ar' ? 'لا توجد أعطال' : 'No Faults Found'}</h3>
            <p className="text-slate-400 mt-2">{uiLang === 'ar' ? 'نظام المحرك يعمل بشكل سليم.' : 'Engine system is operating normally.'}</p>
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
                      {dbEntry ? dbEntry.description[termLang] : (uiLang === 'ar' ? 'عطل غير معروف في قاعدة البيانات (Generic Code)' : 'Unknown fault in database (Generic Code)')}
                    </p>
                    {dbEntry && dbEntry.causes && (
                      <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">{uiLang === 'ar' ? 'الأسباب المحتملة:' : 'Possible Causes:'}</span>
                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                          {dbEntry.causes[termLang].map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs font-medium">{uiLang === 'ar' ? 'المحرك' : 'Engine'}</span>
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs font-medium">{uiLang === 'ar' ? 'عطل حالي' : 'Current Fault'}</span>
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
                {uiLang === 'ar' ? 'التحليل الذكي للأعطال (AI Root Cause Analysis)' : 'AI Root Cause Analysis'}
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
              <h3 className="text-2xl font-bold text-white">{uiLang === 'ar' ? 'تقرير الذكاء الاصطناعي' : 'AI Report'}</h3>
              <p className="text-purple-300/70 text-sm mt-1">{uiLang === 'ar' ? 'تحليل متقدم للسبب الجذري للأعطال' : 'Advanced root cause analysis'}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Root Causes */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
                <h4 className="text-rose-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {uiLang === 'ar' ? 'الأسباب الجذرية (Root Causes)' : 'Root Causes'}
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
                  {uiLang === 'ar' ? 'الأعراض الجانبية (Symptoms)' : 'Symptoms'}
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
              <h4 className="text-indigo-400 font-bold text-lg mb-3">{uiLang === 'ar' ? 'التفسير الفني (Technical Explanation)' : 'Technical Explanation'}</h4>
              <p className="text-slate-300 leading-relaxed text-lg">{aiDiagnosis.explanation}</p>
            </div>

            {/* Recommended Actions */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <h4 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {uiLang === 'ar' ? 'خطوات الإصلاح المقترحة' : 'Recommended Fixes'}
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

function ReadinessItem({ label, ready, uiLang }: { label: string, ready: boolean, uiLang: 'ar' | 'en' }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-400">{label}</span>
      {ready ? (
        <span className="text-emerald-400 font-medium">{uiLang === 'ar' ? 'جاهز' : 'Ready'}</span>
      ) : (
        <span className="text-rose-400 font-medium">{uiLang === 'ar' ? 'غير جاهز' : 'Not Ready'}</span>
      )}
    </div>
  );
}
