import React, { useState, useEffect } from 'react';
import './ContainerLogsConsole.css'; // Optional for custom styles if needed

export default function ContainerLogsConsole() {
  const [containers, setContainers] = useState([
    { id: 'pod-api-gw-789fc', name: 'api-gateway-core', status: 'Running', cpu: '42%', ram: '1.4GB / 2GB', uptime: '4d 12h', logs: [ '[INFO] 2026-09-08 19:00:12 - Route matched: /api/v1/analyze', '[INFO] 2026-09-08 19:00:14 - Proxying request to upstream cluster-01' ] },
    { id: 'pod-db-auth-342ab', name: 'postgres-auth-node', status: 'OOMKilled', cpu: '98%', ram: '3.9GB / 4GB', uptime: '12m', logs: [ '[ERROR] 2026-09-08 19:01:02 - Out of Memory: Kill process 1422 (postgres)', '[FATAL] 2026-09-08 19:01:03 - Container restarted unexpectedly with code 137' ] },
    { id: 'pod-redis-cache-991xx', name: 'redis-cluster-cache', status: 'Warning', cpu: '76%', ram: '780MB / 1GB', uptime: '14d', logs: [ '[WARN] 2026-09-08 18:55:40 - Max memory threshold reached (75%), evicting LRU keys', '[INFO] 2026-09-08 18:59:10 - Evicted 4200 keys successfully' ] },
  ]);

  const [selectedPod, setSelectedPod] = useState(containers[0]);

  // Simulate real-time log streaming or metric fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setContainers(prev => prev.map(pod => {
        if (pod.id === selectedPod.id) {
          const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
          const newLog = `[INFO] ${timestamp} - Health check probe OK. Active connections: ${Math.floor(Math.random() * 50) + 120}`;
          return {
            ...pod,
            logs: [...pod.logs.slice(-10), newLog] // Keep last 10 logs
          };
        }
        return pod;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedPod]);

  return (
    <div className="container-console-wrapper p-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Cluster Telemetry & Container Logs</h2>
          <p className="text-sm text-slate-400">Live monitoring of active microservices, CPU/RAM utilization, and real-time log streams.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Stream Active
        </span>
      </div>

      {/* Pod Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {containers.map(pod => (
          <div 
            key={pod.id}
            onClick={() => setSelectedPod(pod)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedPod.id === pod.id ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-sm text-indigo-400">{pod.name}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                pod.status === 'Running' ? 'bg-emerald-500/20 text-emerald-300' :
                pod.status === 'OOMKilled' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {pod.status}
              </span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>CPU Usage:</span> <span className="font-mono">{pod.cpu}</span></div>
              <div className="flex justify-between"><span>RAM Usage:</span> <span className="font-mono">{pod.ram}</span></div>
              <div className="flex justify-between"><span>Uptime:</span> <span className="font-mono">{pod.uptime}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Terminal / Log Viewer */}
      <div className="bg-black/80 rounded-lg p-4 font-mono text-xs border border-slate-800">
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800 text-slate-400">
          <span>Terminal Logs — <span className="text-indigo-300">{selectedPod.name}</span> ({selectedPod.id})</span>
          <span className="text-[10px] text-slate-500">Auto-tailing enabled</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {selectedPod.logs.map((log, idx) => (
            <div key={idx} className={`${log.includes('ERROR') || log.includes('FATAL') ? 'text-rose-400 font-semibold' : log.includes('WARN') ? 'text-amber-300' : 'text-slate-300'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}