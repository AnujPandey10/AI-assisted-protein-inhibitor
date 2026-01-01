import React, { useState } from 'react';
import { ProteinCandidate } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';
import { Activity, Zap, Shield, Microscope, ChevronLeft } from 'lucide-react';
import { SequenceViewer } from './SequenceViewer';

interface ResultsDashboardProps {
  candidates: ProteinCandidate[];
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ candidates, onReset }) => {
  const [selectedId, setSelectedId] = useState<string>(candidates[0]?.id);

  const selectedCandidate = candidates.find(c => c.id === selectedId) || candidates[0];

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded shadow-lg">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-blue-400 text-sm">Stability: {data.stabilityScore}</p>
          <p className="text-emerald-400 text-sm">Affinity: {data.affinityScore} nM</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> New Design
        </button>
        <h2 className="text-xl font-semibold text-white">Generative Results Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: List & Chart */}
        <div className="lg:col-span-1 space-y-6">
          {/* Chart Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Landscape Analysis
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    type="number" 
                    dataKey="stabilityScore" 
                    name="Stability" 
                    domain={[0, 100]} 
                    tick={{fill: '#94a3b8', fontSize: 10}}
                    label={{ value: 'Stability Score', position: 'bottom', fill: '#94a3b8', fontSize: 10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="affinityScore" 
                    name="Affinity" 
                    tick={{fill: '#94a3b8', fontSize: 10}}
                    label={{ value: 'Kd (nM)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Candidates" data={candidates} fill="#8884d8">
                    {candidates.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.id === selectedId ? '#3b82f6' : '#64748b'} 
                        className="transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedId(entry.id)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">Click point to view candidate</p>
          </div>

          {/* Candidate List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden flex flex-col max-h-[400px]">
             <div className="p-4 border-b border-slate-700 bg-slate-800">
               <h3 className="text-sm font-semibold text-white">Candidates ({candidates.length})</h3>
             </div>
             <div className="overflow-y-auto flex-1 p-2 space-y-2">
               {candidates.map((cand) => (
                 <button
                   key={cand.id}
                   onClick={() => setSelectedId(cand.id)}
                   className={`w-full text-left p-3 rounded-lg border transition-all ${
                     selectedId === cand.id 
                       ? 'bg-blue-600/20 border-blue-500/50 shadow-md' 
                       : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50'
                   }`}
                 >
                   <div className="flex justify-between items-start mb-1">
                     <span className={`font-medium ${selectedId === cand.id ? 'text-blue-300' : 'text-slate-200'}`}>
                       {cand.name}
                     </span>
                     <span className="text-xs font-mono text-emerald-400">{cand.affinityScore} nM</span>
                   </div>
                   <div className="flex gap-2 text-xs text-slate-400">
                     <span>{cand.molecularWeight} kDa</span>
                     <span>•</span>
                     <span>{cand.sequence.length} AA</span>
                   </div>
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-2">
          {selectedCandidate && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-full shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-slate-700">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedCandidate.name}</h2>
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">Generated Design</span>
                     <span className="text-slate-400 text-sm">{selectedCandidate.id}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                   <div className="text-center px-4 py-2 bg-slate-900 rounded-lg border border-slate-700">
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Stability</div>
                      <div className="text-xl font-mono font-semibold text-blue-400">{selectedCandidate.stabilityScore}</div>
                   </div>
                   <div className="text-center px-4 py-2 bg-slate-900 rounded-lg border border-slate-700">
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Folding</div>
                      <div className="text-xl font-mono font-semibold text-emerald-400">{selectedCandidate.foldingConfidence}%</div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                   <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-yellow-500" /> Mechanism of Action
                   </h4>
                   <p className="text-slate-400 text-sm leading-relaxed">
                     {selectedCandidate.description}
                   </p>
                </div>
                <div>
                   <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                     <Microscope className="w-4 h-4 text-purple-500" /> Target Interaction
                   </h4>
                   <p className="text-slate-400 text-sm leading-relaxed">
                     Designed to interact with {selectedCandidate.targetMechanism}. 
                     Optimized for high specificity binding interface.
                   </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" /> Sequence Structure
                </h4>
                <SequenceViewer sequence={selectedCandidate.sequence} />
              </div>
              
              <div className="flex justify-end pt-4">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20">
                  Export to Lab Synthesis (.fasta)
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
