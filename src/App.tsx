import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, Users, Heart, Eye, Hash, Calendar, 
  LayoutDashboard, PlaySquare, Zap, Activity,
  Server, Shield, Terminal, Play, Pause, AlertTriangle, CheckCircle2, ChevronDown, Check
} from 'lucide-react';
import { cn } from './lib/utils';
import { growthData } from './data';

type LogEntry = {
  id: string;
  time: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('engine');
  
  // Engine State
  const [targetAccount, setTargetAccount] = useState('@username');
  const [serviceType, setServiceType] = useState('followers');
  const [quantity, setQuantity] = useState(1000);
  const [speed, setSpeed] = useState('Aggressive');
  
  const [engineStatus, setEngineStatus] = useState<'IDLE' | 'DEPLOYING' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), type: 'INFO', message: 'System initialized. Ready for deployment.' }
  ]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (engineStatus === 'DEPLOYING') {
      let step = 0;
      interval = setInterval(() => {
        step++;
        if (step === 1) addLog('INFO', 'Establishing secure proxy tunnel (HK-08 cluster)...');
        if (step === 2) addLog('INFO', 'Bypassing basic detection matrix...');
        if (step === 3) addLog('SUCCESS', 'Connection established. Handshake complete.');
        if (step === 4) {
          addLog('INFO', `Starting injection of ${quantity} ${serviceType} to ${targetAccount}`);
          setEngineStatus('RUNNING');
        }
      }, 1500);
    } else if (engineStatus === 'RUNNING') {
      interval = setInterval(() => {
        setProgress(p => {
          const newP = p + (speed === 'Aggressive' ? Math.random() * 5 : Math.random() * 2);
          if (newP >= 100) {
            setEngineStatus('IDLE');
            addLog('SUCCESS', `Task completed. Successfully injected ${quantity} ${serviceType}.`);
            return 100;
          }
          return newP;
        });
        
        // Random logs
        const rand = Math.random();
        if (rand > 0.8) {
          const batch = Math.floor(Math.random() * 50) + 10;
          addLog('SUCCESS', `Injected batch of ${batch} ${serviceType}.`);
        } else if (rand < 0.05) {
          addLog('WARNING', 'High latency detected on Node US-WEST-2. Rerouting...');
        }
      }, speed === 'Aggressive' ? 800 : 2000);
    }
    return () => clearInterval(interval);
  }, [engineStatus, targetAccount, serviceType, quantity, speed]);

  const addLog = (type: LogEntry['type'], message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      type,
      message
    }].slice(-50)); // Keep last 50
  };

  const handleDeploy = async () => {
    if (engineStatus === 'IDLE' || engineStatus === 'PAUSED') {
      setProgress(0);
      setEngineStatus('DEPLOYING');
      addLog('INFO', `Initializing engine deployment via core server for ${targetAccount}...`);
      
      try {
        const response = await fetch('/api/engine/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetAccount, serviceType, quantity, speed })
        });
        
        const data = await response.json();
        if (response.ok) {
           addLog('SUCCESS', `Server connected: ${data.message}`);
           if (data.details) {
             addLog('INFO', `Output: ${data.details.substring(0, 100)}...`);
           }
        } else {
           addLog('ERROR', `Server error: ${data.message}`);
           if (data.details) {
             addLog('ERROR', `Details: ${data.details.substring(0, 100)}...`);
           }
           setEngineStatus('IDLE');
        }
      } catch (err) {
        addLog('ERROR', 'Failed to connect to the core engine server.');
        setEngineStatus('IDLE');
      }
    } else {
      setEngineStatus('PAUSED');
      addLog('WARNING', 'Engine paused by user.');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0D0D0D] text-white font-sans overflow-hidden p-6 selection:bg-[#FE2C55] selection:text-white">
      {/* Header Navigation */}
      <header className="flex items-center justify-between mb-6 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] rounded-xl flex items-center justify-center shadow-lg shadow-[#FE2C55]/20">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">GrowthEngine <span className="text-[#777]">| Command Center</span></h1>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-[#777]">System Status</span>
            <span className="text-xs font-medium text-[#25F4EE]">OPERATIONAL • 99.8%</span>
          </div>
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[10px] uppercase tracking-widest text-[#777]">Active Proxies</span>
            <span className="text-xs font-medium text-[#FE2C55]">1,242 NODES</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar Controls */}
        <aside className="w-72 flex flex-col gap-4 hidden md:flex shrink-0 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#333]">
          
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#777] mb-4 flex items-center gap-2">
              <Server className="w-3.5 h-3.5" /> Engine Configuration
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#999] font-medium uppercase tracking-wider">Target Account</label>
                <input 
                  type="text" 
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  disabled={engineStatus !== 'IDLE' && engineStatus !== 'PAUSED'}
                  className="w-full bg-[#222] border border-[#333] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#25F4EE] transition-colors disabled:opacity-50 text-white"
                  placeholder="@username or Post URL"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#999] font-medium uppercase tracking-wider">Injection Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setServiceType('followers')}
                    disabled={engineStatus !== 'IDLE' && engineStatus !== 'PAUSED'}
                    className={cn(
                      "py-2 px-3 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50",
                      serviceType === 'followers' ? "bg-[#25F4EE]/10 border-[#25F4EE]/50 text-[#25F4EE]" : "bg-[#222] border-[#333] text-[#777] hover:border-[#444]"
                    )}
                  >
                    <Users className="w-3.5 h-3.5" /> Followers
                  </button>
                  <button 
                    onClick={() => setServiceType('likes')}
                    disabled={engineStatus !== 'IDLE' && engineStatus !== 'PAUSED'}
                    className={cn(
                      "py-2 px-3 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50",
                      serviceType === 'likes' ? "bg-[#FE2C55]/10 border-[#FE2C55]/50 text-[#FE2C55]" : "bg-[#222] border-[#333] text-[#777] hover:border-[#444]"
                    )}
                  >
                    <Heart className="w-3.5 h-3.5" /> Likes
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#999] font-medium uppercase tracking-wider flex justify-between">
                  <span>Quantity</span>
                  <span className="text-[#25F4EE]">{quantity.toLocaleString()}</span>
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={engineStatus !== 'IDLE' && engineStatus !== 'PAUSED'}
                  className="w-full accent-[#25F4EE] disabled:opacity-50"
                />
              </div>

               <div className="space-y-1.5">
                <label className="text-[10px] text-[#999] font-medium uppercase tracking-wider">Growth Speed</label>
                <div className="flex bg-[#222] border border-[#333] rounded-xl p-1 disabled:opacity-50">
                  {['Gradual', 'Aggressive'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      disabled={engineStatus !== 'IDLE' && engineStatus !== 'PAUSED'}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50",
                        speed === s ? "bg-[#333] text-white shadow-sm" : "text-[#777] hover:text-gray-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#222] rounded-xl border border-[#333]">
                <label className="text-[10px] text-[#999] block mb-1">API CLUSTER</label>
                <p className="text-xs font-mono text-gray-300">HK-08 (Priority Routing)</p>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={handleDeploy}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2",
                  (engineStatus === 'IDLE' || engineStatus === 'PAUSED')
                    ? "bg-gradient-to-r from-[#FE2C55] to-[#FF5E7B] shadow-[#FE2C55]/20 text-white hover:opacity-90"
                    : "bg-[#222] border border-[#333] text-[#FE2C55] hover:bg-[#2a2a2a]"
                )}
              >
                {(engineStatus === 'IDLE' || engineStatus === 'PAUSED') ? (
                  <><Play className="w-4 h-4 fill-current" /> DEPLOY ENGINE</>
                ) : (
                  <><Pause className="w-4 h-4 fill-current" /> STOP ENGINE</>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#333] border-2 border-[#25F4EE] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#25F4EE]" />
            </div>
            <div>
              <p className="text-xs font-semibold">User: ADM-04</p>
              <p className="text-[10px] text-[#777]">Super Admin Access</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
             <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-widest text-[#777]">Engine Status</p>
              <p className={cn(
                "text-2xl font-bold mt-1 tracking-tight flex items-center gap-2",
                engineStatus === 'RUNNING' ? "text-[#25F4EE]" : engineStatus === 'DEPLOYING' ? "text-yellow-400" : "text-[#777]"
              )}>
                {engineStatus === 'RUNNING' && <span className="w-2.5 h-2.5 rounded-full bg-[#25F4EE] animate-pulse" />}
                {engineStatus}
              </p>
              <div className="h-1 w-full bg-[#222] mt-4 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", engineStatus === 'RUNNING' ? "bg-[#25F4EE]" : "bg-[#555]")} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-widest text-[#777]">Total Injected Today</p>
              <p className="text-2xl font-bold mt-1 tracking-tight">14.2K</p>
              <div className="h-1 w-full bg-[#222] mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-[#FE2C55]" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-widest text-[#777]">Network Efficiency</p>
              <p className="text-2xl font-bold mt-1 tracking-tight text-white">98.4%</p>
              <div className="h-1 w-full bg-[#222] mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0 flex-1">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col min-h-[350px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#777]">Live Injection Velocity</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FE2C55] animate-pulse"></span>
                  <span className="text-[10px] text-[#999] font-mono">LIVE SYNC</span>
                </div>
              </div>
              <div className="flex-1 min-h-[250px] relative">
                {/* Mock Graph Simulation matching HTML request */}
                <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2 px-2">
                  {[30,45,40,60,75,90,55,65,80,45,35,95,70].map((h, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-1000",
                        engineStatus === 'RUNNING' && i % 4 === 0 ? "bg-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.4)]" :
                        engineStatus === 'RUNNING' && i % 5 === 0 ? "bg-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.4)]" :
                        "bg-[#222]"
                      )}
                      style={{ 
                        height: engineStatus === 'RUNNING' ? `${h + (Math.random() * 10 - 5)}%` : `${h * 0.3}%` 
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal Log */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col relative overflow-hidden">
               <h2 className="text-xs font-semibold uppercase tracking-widest text-[#777] mb-4 flex items-center gap-2 shrink-0">
                <Terminal className="w-4 h-4" /> Live Activity Log
              </h2>
              
              <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1.5 pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#333]">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-2 border-b border-[#222]/50 pb-1.5">
                    <span className="text-[#555] shrink-0">[{log.time}]</span>
                    <span className={cn(
                      "shrink-0",
                      log.type === 'SUCCESS' ? "text-[#25F4EE]" :
                      log.type === 'WARNING' ? "text-yellow-400" :
                      log.type === 'ERROR' ? "text-[#FE2C55]" :
                      "text-gray-400"
                    )}>
                      {log.type === 'INFO' && <Activity className="w-3 h-3 inline mr-1" />}
                      {log.type === 'SUCCESS' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {log.type === 'WARNING' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>

              {engineStatus === 'RUNNING' && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1A1A1A] to-transparent pointer-events-none"></div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

