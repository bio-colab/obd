import React, { useEffect, useState } from 'react';
import { useCarStore } from '../store/carStore';
import { PIDS } from '../lib/obd/pids';
import { db } from '../lib/db';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function Dashboard() {
  const { liveData, sessionId } = useCarStore();
  const [history, setHistory] = useState<{ speed: number[], rpm: number[], labels: string[] }>({ speed: [], rpm: [], labels: [] });

  const speed = liveData.SPEED || 0;
  const rpm = liveData.RPM || 0;
  const temp = liveData.TEMP || 0;
  const voltage = liveData.BATTERY || 0;

  useEffect(() => {
    if (!sessionId) return;
    
    const fetchHistory = async () => {
      const readings = await db.readings
        .where('sessionId')
        .equals(sessionId)
        .reverse()
        .limit(20)
        .toArray();
      
      const reversed = readings.reverse();
      setHistory({
        speed: reversed.map(r => r.speed),
        rpm: reversed.map(r => r.rpm / 100),
        labels: reversed.map(r => new Date(r.timestamp).toLocaleTimeString('ar-SA', { minute: '2-digit', second: '2-digit' }))
      });
    };

    fetchHistory();
    // Set up an interval to fetch history periodically to keep chart updated
    const interval = setInterval(fetchHistory, 1500);
    return () => clearInterval(interval);
  }, [sessionId, speed, rpm]); // Re-fetch when speed/rpm changes

  const chartData = {
    labels: history.labels.length > 0 ? history.labels : Array.from({ length: 20 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'السرعة (km/h)',
        data: history.speed.length > 0 ? history.speed : Array.from({ length: 20 }, () => 0),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'دورة المحرك (RPM / 100)',
        data: history.rpm.length > 0 ? history.rpm : Array.from({ length: 20 }, () => 0),
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, display: true, ticks: { color: '#64748b', maxTicksLimit: 5 } }
    },
    plugins: {
      legend: { labels: { color: '#94a3b8' } }
    },
    animation: {
      duration: 0 // Disable animation for smoother live updates
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-100">لوحة القيادة المباشرة</h2>
        <p className="text-slate-400 mt-2">مراقبة حية لبيانات المحرك والحساسات (Live Data Stream)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="السرعة" value={speed} unit="km/h" color="text-indigo-400" />
        <StatCard title="دورة المحرك" value={rpm} unit="RPM" color="text-rose-400" />
        <StatCard title="حرارة المحرك" value={temp} unit="°C" color={temp > 100 ? 'text-red-500' : 'text-amber-400'} />
        <StatCard title="جهد البطارية" value={voltage.toFixed(1)} unit="V" color={voltage < 12 ? 'text-red-500' : 'text-emerald-400'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-96">
          <h3 className="text-lg font-medium text-slate-200 mb-4">الأداء المباشر</h3>
          <div className="h-72">
            <Line data={chartData} options={chartOptions as any} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-96">
          <h3 className="text-lg font-medium text-slate-200 mb-4">قائمة البيانات الحية (Data List)</h3>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {Object.keys(PIDS).map(key => {
              const pid = PIDS[key];
              const val = liveData[key];
              return (
                <SensorRow 
                  key={key}
                  label={pid.name} 
                  value={val !== undefined ? `${typeof val === 'number' ? val.toFixed(1) : val} ${pid.unit}` : '--'} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, color }: { title: string, value: string | number, unit: string, color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
      <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold font-mono ${color}`}>{value}</span>
        <span className="text-sm text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
  );
}

const SensorRow: React.FC<{ label: string, value: string }> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-slate-200 font-mono font-medium">{value}</span>
    </div>
  );
}
