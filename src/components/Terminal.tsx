import React, { useState, useRef, useEffect } from 'react';
import { useCarStore } from '../store/carStore';
import { Terminal as TerminalIcon, Send, Trash2 } from 'lucide-react';

export function Terminal() {
  const { terminalLogs, sendRawCommand, isConnected } = useCarStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected || loading) return;

    const cmd = input.trim().toUpperCase();
    setInput('');
    setLoading(true);
    
    try {
      await sendRawCommand(cmd);
    } catch (err) {
      // Error is handled and logged in the store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <header>
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <TerminalIcon className="w-8 h-8 text-indigo-400" />
          وحدة تحكم الأوامر (Raw Terminal)
        </h2>
        <p className="text-slate-400 mt-2">إرسال أوامر AT و OBD-II مباشرة إلى شريحة ELM327</p>
      </header>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden font-mono text-sm">
        <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center">
          <span className="text-slate-400">ELM327 Console</span>
          <div className="flex gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2" dir="ltr">
          {terminalLogs.length === 0 ? (
            <div className="text-slate-600 text-center mt-10">لا توجد سجلات. ابدأ بإرسال أوامر مثل "ATZ" أو "0100".</div>
          ) : (
            terminalLogs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-slate-600 shrink-0">
                  [{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}]
                </span>
                {log.type === 'send' && <span className="text-indigo-400 shrink-0">{'>'}</span>}
                {log.type === 'receive' && <span className="text-emerald-400 shrink-0">{'<'}</span>}
                {log.type === 'info' && <span className="text-blue-400 shrink-0">{'i'}</span>}
                {log.type === 'error' && <span className="text-rose-400 shrink-0">{'!'}</span>}
                
                <span className={`break-all ${
                  log.type === 'send' ? 'text-indigo-300' :
                  log.type === 'receive' ? 'text-emerald-300' :
                  log.type === 'error' ? 'text-rose-300' : 'text-blue-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3" dir="ltr">
          <span className="text-indigo-400 font-bold text-lg mt-1">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isConnected || loading}
            placeholder={isConnected ? "Enter AT/OBD command..." : "Connect to device first..."}
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-600"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={!isConnected || loading || !input.trim()}
            className="p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
