import React from 'react';
import { useCarStore } from '../store/carStore';
import { useI18n } from '../lib/i18n';
import { AlertTriangle } from 'lucide-react';

export function DemoWarning() {
  const { connectionType } = useCarStore();
  const { t } = useI18n();

  if (connectionType !== 'demo') return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 mb-4 text-sm">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <p>{t('demoWarning') || 'هذه بيانات محاكاة (Demo Mode) لأغراض التجربة فقط. البيانات المعروضة غير حقيقية.'}</p>
    </div>
  );
}
