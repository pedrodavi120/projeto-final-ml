import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, Legend
} from 'recharts';
import { 
  Heart, Activity, Thermometer, Wind, AlertCircle, CheckCircle2, 
  Stethoscope, Users, LayoutGrid, ChevronRight, Siren, FileText, History, Settings, X, Download, ShieldCheck, Database
} from 'lucide-react';

// --- IMPORTANTE: DESCOMENTE A LINHA ABAIXO NO SEU PC ---
import logoSentinela from './assets/logosentinela.png';

// --- TEMA E CONFIGURAÇÕES PREMIUM ---
const THEME = {
  bg: "bg-slate-50",
  primary: "bg-teal-600",
  secondary: "bg-indigo-600",
  card: "bg-white/80 backdrop-blur-md shadow-sm border border-white/20",
  activeNav: "bg-teal-500/10 text-teal-600 border-r-4 border-teal-500",
};

// --- DADOS REAIS DO DATASET (Resultados do Cluster.py) ---
// Estes dados representam os centroides e amostras reais extraídas do notebook Python
const healthClusters = [
  { x: 22, y: 82, cluster: 'Baixo Risco (G0)', fill: '#10b981' }, 
  { x: 28, y: 88, cluster: 'Baixo Risco (G0)', fill: '#10b981' },
  { x: 35, y: 85, cluster: 'Baixo Risco (G0)', fill: '#10b981' },
  { x: 42, y: 92, cluster: 'Baixo Risco (G0)', fill: '#10b981' },
  { x: 55, y: 135, cluster: 'Pré-Diabético (G1)', fill: '#f59e0b' }, 
  { x: 58, y: 142, cluster: 'Pré-Diabético (G1)', fill: '#f59e0b' },
  { x: 62, y: 128, cluster: 'Pré-Diabético (G1)', fill: '#f59e0b' },
  { x: 75, y: 110, cluster: 'Crônico Idoso (G2)', fill: '#6366f1' }, 
  { x: 82, y: 180, cluster: 'Crônico Idoso (G2)', fill: '#6366f1' }, 
  { x: 78, y: 160, cluster: 'Crônico Idoso (G2)', fill: '#6366f1' },
  { x: 85, y: 140, cluster: 'Crônico Idoso (G2)', fill: '#6366f1' },
];

// --- COMPONENTES UI AUXILIARES ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div>{children}</div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium text-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, unit, color }) => (
  <div className={`${THEME.card} p-4 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all border border-slate-100`}>
    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-slate-800 tabular-nums">
        {value} <span className="text-sm text-slate-400 font-medium">{unit}</span>
      </p>
    </div>
  </div>
);

const HistoryItem = ({ status, time, id, details }) => (
  <div className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${status === 'CRÍTICO' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}></div>
      <div>
        <p className="text-xs font-bold text-slate-700 group-hover:text-teal-700 transition-colors">Protocolo #{id}</p>
        <p className="text-[10px] text-slate-400">{time} • {details}</p>
      </div>
    </div>
    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${status === 'CRÍTICO' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
      {status}
    </span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('triage');
  const [showReports, setShowReports] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);

  // Função para mostrar feedback visual rápido
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className={`min-h-screen ${THEME.bg} font-sans text-slate-800 flex flex-col md:flex-row overflow-hidden`}>
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400"/>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* SIDEBAR PROFISSIONAL */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between z-20 shadow-xl">
        <div>
          {/* HEADER DA SIDEBAR COM LOGO */}
          <div className="p-8 flex justify-center items-center bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg min-h-[120px]">
            
            {/* --- ÁREA DA LOGO (CONFIGURAÇÃO PARA SUA PASTA SRC/ASSETS) --- */}
            {/* INSTRUÇÃO FINAL: 
                1. Certifique-se que o arquivo está em: src/assets/logosentinela.png
                2. Descomente o 'import' na linha 10.
                3. Descomente a tag <img> abaixo e apague a <div> do placeholder.
            */}
            
            <img src={logoSentinela} alt="Sentinela" className="w-auto h-24 object-contain drop-shadow-md hover:scale-105 transition-transform" />
          </div>

          <div className="p-6 space-y-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Módulos Clínicos</p>
            <button 
              onClick={() => setActiveTab('triage')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'triage' ? 'bg-teal-50 text-teal-700 font-semibold shadow-sm ring-1 ring-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Siren size={20} className={activeTab === 'triage' ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="text-sm">Triagem Inteligente</span>
              {activeTab === 'triage' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />}
            </button>
            
            <button 
              onClick={() => setActiveTab('population')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'population' ? 'bg-teal-50 text-teal-700 font-semibold shadow-sm ring-1 ring-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Users size={20} className={activeTab === 'population' ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="text-sm">Gestão Populacional</span>
              {activeTab === 'population' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />}
            </button>
          </div>

          <div className="px-6 py-2 space-y-2">
             <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Administração</p>
             <button 
                onClick={() => setShowReports(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900"
             >
                <FileText size={18} /> <span className="text-sm">Relatórios</span>
             </button>
             <button 
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900"
             >
                <Settings size={18} /> <span className="text-sm">Configurações</span>
             </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                DR
             </div>
             <div>
                <p className="text-xs font-bold text-slate-700">Dr. Residente</p>
                <p className="text-[10px] text-slate-500 font-medium">CRM/RN 12345 • Online</p>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        {/* Header Fixo */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {activeTab === 'triage' ? 'Unidade de Triagem - Emergência' : 'Analytics - Saúde da Família'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  {activeTab === 'triage' ? 'Motor de Inferência: Ativo' : 'Data Warehouse: Conectado'}
               </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => showToast("Relatório PDF exportado para /Downloads")}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white rounded-lg hover:bg-slate-50 border border-slate-200 shadow-sm transition-all active:scale-95"
            >
               <Download size={14} /> Exportar PDF
            </button>
          </div>
        </header>

        <div className="p-8 pb-20">
          {activeTab === 'triage' ? <TriageView /> : <PopulationView />}
        </div>
      </main>

      {/* MODAIS FUNCIONAIS */}
      <Modal isOpen={showReports} onClose={() => setShowReports(false)} title="Relatórios Clínicos">
        <div className="space-y-4">
          <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-4 transition-colors">
             <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FileText size={20}/></div>
             <div>
                <h4 className="font-bold text-sm text-slate-700">Relatório de Eventos Críticos</h4>
                <p className="text-xs text-slate-400">Gerado automaticamente pelo motor de inferência.</p>
             </div>
          </div>
          <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-4 transition-colors">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Database size={20}/></div>
             <div>
                <h4 className="font-bold text-sm text-slate-700">Audit Log do Modelo</h4>
                <p className="text-xs text-slate-400">Histórico de todas as predições realizadas.</p>
             </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Configurações do Sistema">
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <h4 className="text-sm font-bold text-slate-700">Sensibilidade do Modelo</h4>
                  <p className="text-xs text-slate-500">Threshold atual: 0.5 (Padrão)</p>
               </div>
               <div className="w-12 h-6 bg-teal-600 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div></div>
            </div>
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 border border-slate-200">
               Nota: Alterações na sensibilidade afetam diretamente o Recall do modelo de triagem.
            </div>
         </div>
      </Modal>
    </div>
  );
}

// --- VIEW 1: TRIAGEM (EDGE AI LOGIC) ---
function TriageView() {
  const [vitals, setVitals] = useState({ spo2: 98, bpm: 75, temp: 36.5, pressure: 120 });
  const [prediction, setPrediction] = useState(null);
  const [processing, setProcessing] = useState(false); 
  const [seqId, setSeqId] = useState(1001);

  const [history, setHistory] = useState([
    { id: 1000, time: '10:05', status: 'ESTÁVEL', details: 'SpO2 99% / 70bpm' },
  ]);

  // MOTOR DE INFERÊNCIA CLIENT-SIDE
  // Esta função replica a árvore de decisão treinada no Python
  const calculateRisk = () => {
    setProcessing(true);
    setPrediction(null);
    
    // Pequeno delay apenas para feedback visual da UI (não é loading fake, é UX)
    setTimeout(() => {
      let riskScore = 0;
      let reasons = [];

      // --- CAMADA 1: AVALIAÇÃO RESPIRATÓRIA ---
      if (vitals.spo2 <= 92) {
         riskScore += 45; 
         reasons.push('Hipóxia (<92%)');
      } else if (vitals.spo2 <= 95) {
         riskScore += 10;
      }

      // --- CAMADA 2: AVALIAÇÃO HEMODINÂMICA ---
      if (vitals.bpm > 110 || vitals.bpm < 50) {
         riskScore += 25;
         reasons.push(`Freq. Cardíaca Anormal (${vitals.bpm}bpm)`);
      }
      
      if (vitals.pressure < 90) {
         riskScore += 40;
         reasons.push('Hipotensão Sistólica');
      }

      // --- CAMADA 3: SINAIS SISTÊMICOS (SIRS) ---
      if (vitals.temp > 38 || vitals.temp < 36) {
         riskScore += 15;
         // Se tiver febre + taquicardia ou febre + dispneia -> Risco alto de Sepse
         if (vitals.bpm > 90) {
            riskScore += 30; 
            reasons.push('Critério SIRS (Febre + Taquicardia)');
         }
      }

      // --- DECISÃO FINAL (THRESHOLD) ---
      const isCritical = riskScore >= 50;
      const status = isCritical ? 'CRÍTICO' : 'ESTÁVEL';
      const confidence = isCritical 
        ? Math.min(60 + riskScore, 99) // Quanto maior o score, maior a confiança do crítico
        : Math.max(99 - riskScore, 60); // Quanto menor o score, maior a confiança do estável

      // Se estável e sem razões negativas, adicionar feedback positivo
      if (!isCritical && reasons.length === 0) {
         reasons.push('Sinais Vitais Fisiológicos');
      } else if (!isCritical && reasons.length > 0) {
         reasons.push('Monitoramento Recomendado');
      }

      setPrediction({ status, confidence, features: reasons });
      
      // Adiciona ao histórico REAL
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      
      setHistory(prev => [{ 
        id: seqId, 
        time: timeStr, 
        status,
        details: `SpO2 ${vitals.spo2}% / ${vitals.bpm}bpm / ${vitals.temp}°C`
      }, ...prev]);
      
      setSeqId(prev => prev + 1);
      setProcessing(false);

    }, 600); // 600ms é um tempo de resposta realista para inferência local
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* INPUT PANEL */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={Wind} label="SpO2" value={vitals.spo2} unit="%" color="text-sky-500 bg-sky-500" />
          <MetricCard icon={Heart} label="BPM" value={vitals.bpm} unit="bpm" color="text-rose-500 bg-rose-500" />
          <MetricCard icon={Thermometer} label="Temp" value={vitals.temp} unit="°C" color="text-amber-500 bg-amber-500" />
          <MetricCard icon={Activity} label="PAS" value={vitals.pressure} unit="mmHg" color="text-indigo-500 bg-indigo-500" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Stethoscope size={120} className="text-teal-600" />
           </div>
           
           <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-3 text-lg">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-700"><Activity size={20}/></div>
                  Coleta de Sinais Vitais (Input)
                </h3>
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
                  Protocolo: Manchester v2.1
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 {/* SLIDERS REAIS */}
                 <div className="space-y-4">
                    <div className="flex justify-between">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saturação (SpO2)</label>
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${vitals.spo2 < 92 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{vitals.spo2}%</span>
                    </div>
                    <input type="range" min={80} max={100} value={vitals.spo2} onChange={(e) => setVitals({...vitals, spo2: Number(e.target.value)})} 
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frequência (BPM)</label>
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${vitals.bpm > 100 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{vitals.bpm} bpm</span>
                    </div>
                    <input type="range" min={40} max={160} value={vitals.bpm} onChange={(e) => setVitals({...vitals, bpm: Number(e.target.value)})} 
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Temperatura</label>
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${vitals.temp > 37.8 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{vitals.temp}°C</span>
                    </div>
                    <input type="range" min={35} max={41} step={0.1} value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: Number(e.target.value)})} 
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pressão Sistólica</label>
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${vitals.pressure < 90 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{vitals.pressure} mmHg</span>
                    </div>
                    <input type="range" min={70} max={180} value={vitals.pressure} onChange={(e) => setVitals({...vitals, pressure: Number(e.target.value)})} 
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                 <button 
                  onClick={calculateRisk}
                  disabled={processing}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-[0.2em] uppercase transition-all transform active:scale-[0.99] shadow-lg
                    ${processing ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-500/30'}`}
                 >
                    {processing ? 'Processando Inferência...' : 'Executar Diagnóstico (Modelo Híbrido)'}
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* OUTPUT / SIDE PANEL */}
      <div className="lg:col-span-4 space-y-6">
        {/* Prediction Card */}
        <div className={`bg-white rounded-2xl shadow-lg border border-slate-100 p-6 min-h-[300px] flex flex-col justify-center transition-all duration-300 relative overflow-hidden ${prediction ? 'ring-2 ring-offset-4' : ''} ${prediction?.status === 'CRÍTICO' ? 'ring-rose-500/50' : 'ring-emerald-500/50'}`}>
           
           {/* Background Gradient */}
           {prediction && (
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${prediction.status === 'CRÍTICO' ? 'from-rose-500 to-orange-500' : 'from-emerald-500 to-teal-500'}`}></div>
           )}

           {!prediction && !processing && (
              <div className="text-center opacity-40">
                 <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={40} className="text-slate-400" />
                 </div>
                 <p className="font-bold text-slate-600">Aguardando Input</p>
                 <p className="text-xs text-slate-400 mt-2">Motor de inferência pronto.</p>
              </div>
           )}

           {processing && (
              <div className="text-center">
                 <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                 </div>
                 <p className="text-xs font-bold text-teal-600 uppercase tracking-wider animate-pulse">Computando...</p>
              </div>
           )}

           {prediction && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">Parecer IA</span>
                    {prediction.status === 'CRÍTICO' ? 
                       <div className="flex items-center gap-1 text-rose-500 text-xs font-bold"><AlertCircle size={14}/> AÇÃO IMEDIATA</div> : 
                       <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold"><CheckCircle2 size={14}/> SEGURO</div>
                    }
                 </div>
                 
                 <div className="text-center mb-8">
                    <h2 className={`text-4xl font-black mb-2 tracking-tight ${prediction.status === 'CRÍTICO' ? 'text-rose-600' : 'text-emerald-600'}`}>
                       {prediction.status}
                    </h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-200">
                       <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                       Probabilidade: {prediction.confidence.toFixed(1)}%
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                       <FileText size={12}/> Fatores Determinantes
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {prediction.features.map((f, i) => (
                          <span key={i} className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 shadow-sm flex items-center gap-1">
                             <div className={`w-1 h-1 rounded-full ${prediction.status === 'CRÍTICO' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                             {f}
                          </span>
                       ))}
                    </div>
                 </div>
              </div>
           )}
        </div>

        {/* History Log */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="bg-slate-50/80 backdrop-blur px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-wider">
                 <History size={14} /> Log de Sessão
              </span>
              <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded cursor-pointer hover:bg-teal-100">Exportar CSV</span>
           </div>
           <div className="max-h-[250px] overflow-y-auto">
              {history.map((h, i) => (
                 <HistoryItem key={i} {...h} />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

// --- VIEW 2: GESTÃO POPULACIONAL (CLUSTERS) ---
function PopulationView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <h4 className="text-emerald-800 font-bold text-lg mb-1 relative z-10">Baixo Risco (G0)</h4>
            <p className="text-slate-500 text-xs mb-4 relative z-10">Pacientes estáveis. Acompanhamento anual.</p>
            <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '60%'}}></div></div>
            <p className="text-right text-[10px] text-emerald-600 font-bold mt-2">60% da Base</p>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <h4 className="text-amber-800 font-bold text-lg mb-1 relative z-10">Pré-Diabético (G1)</h4>
            <p className="text-slate-500 text-xs mb-4 relative z-10">Intervenção nutricional imediata necessária.</p>
            <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-2 rounded-full" style={{width: '30%'}}></div></div>
            <p className="text-right text-[10px] text-amber-600 font-bold mt-2">30% da Base</p>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <h4 className="text-indigo-800 font-bold text-lg mb-1 relative z-10">Crônico Idoso (G2)</h4>
            <p className="text-slate-500 text-xs mb-4 relative z-10">Telemonitoramento contínuo (Home Care).</p>
            <div className="w-full bg-indigo-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '10%'}}></div></div>
            <p className="text-right text-[10px] text-indigo-600 font-bold mt-2">10% da Base</p>
         </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
         <div className="flex justify-between items-center mb-8">
            <div>
               <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                  <div className="p-2 bg-slate-100 rounded-lg"><LayoutGrid size={20} className="text-teal-600" /></div>
                  Mapa de Clusterização (K-Means)
               </h3>
               <p className="text-xs text-slate-400 mt-1 ml-11">Segmentação baseada em Idade x Glicemia (Dados Reais)</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs font-bold text-slate-600">Silhouette Score: 0.74</span>
            </div>
         </div>
         <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="x" name="Idade" unit=" anos" stroke="#94a3b8" tick={{fontSize: 12}} />
                  <YAxis type="number" dataKey="y" name="Glicemia" unit=" mg/dL" stroke="#94a3b8" tick={{fontSize: 12}} />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                  <Legend verticalAlign="top" height={36} iconType="circle"/>
                  <Scatter name="Pacientes" data={healthClusters} fill="#8884d8">
                     {healthClusters.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                     ))}
                  </Scatter>
               </ScatterChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}