import React, { useState } from 'react';
import { DesignRequest } from '../types';
import { Beaker, Dna, Settings2, ArrowRight } from 'lucide-react';

interface DesignFormProps {
  onSubmit: (data: DesignRequest) => void;
  isLoading: boolean;
}

export const DesignForm: React.FC<DesignFormProps> = ({ onSubmit, isLoading }) => {
  const [targetName, setTargetName] = useState('EGFR (Epidermal Growth Factor Receptor)');
  const [desiredFunction, setDesiredFunction] = useState('Allosteric inhibition of the kinase domain to prevent signaling.');
  const [minStability, setMinStability] = useState(70);
  const [maxWeight, setMaxWeight] = useState(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      targetName,
      desiredFunction,
      constraints: {
        minStability,
        maxWeight
      }
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Beaker className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Define Design Parameters</h2>
            <p className="text-slate-400 text-sm">Input the biological constraints for the generative model.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Target Protein / Receptor</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="e.g. KRAS G12C"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Desired Mechanism of Action</label>
              <textarea
                value={desiredFunction}
                onChange={(e) => setDesiredFunction(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Describe how the designed protein should interact with the target..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700/50">
            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Settings2 className="w-4 h-4" /> Min Stability Score
                </label>
                <span className="text-blue-400 font-mono text-sm">{minStability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={minStability}
                onChange={(e) => setMinStability(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Dna className="w-4 h-4" /> Max Molecular Weight
                </label>
                <span className="text-blue-400 font-mono text-sm">{maxWeight} kDa</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={maxWeight}
                onChange={(e) => setMaxWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                isLoading 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                  Generative Model Running...
                </>
              ) : (
                <>
                  Generate Candidates <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};