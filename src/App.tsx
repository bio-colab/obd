import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Settings as SettingsIcon, Gauge, Zap, Car, Terminal as TerminalIcon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Diagnostics } from './components/Diagnostics';
import { Settings } from './components/Settings';
import { Terminal } from './components/Terminal';
import { useCarStore } from './store/carStore';
import { useI18n } from './lib/i18n';

function Sidebar() {
  const location = useLocation();
  const { isConnected, connectionType } = useCarStore();
  const { t, uiLang } = useI18n();

  const links = [
    { path: '/', name: t('dashboard'), icon: Gauge },
    { path: '/diagnostics', name: t('diagnostics'), icon: AlertTriangle },
    { path: '/terminal', name: t('terminal'), icon: TerminalIcon },
    { path: '/settings', name: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className="w-64 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Car className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Super OBD</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="text-xs text-slate-400">
              {isConnected ? `${t('connected')} (${connectionType})` : t('disconnected')}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  const { uiLang } = useI18n();

  useEffect(() => {
    document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  return (
    <Router>
      <div className={`flex h-screen bg-slate-950 text-slate-50 font-sans ${uiLang === 'ar' ? 'rtl' : 'ltr'}`} dir={uiLang === 'ar' ? 'rtl' : 'ltr'}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/terminal" element={<Terminal />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
