import React, { useState } from 'react';
import { DesignForm } from './components/DesignForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { generateProteins } from './services/geminiService';
import { AppState, DesignRequest, ProteinCandidate } from './types';
import { Dna, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [candidates, setCandidates] = useState<ProteinCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDesignSubmit = async (request: DesignRequest) => {
    setAppState(AppState.GENERATING);
    setError(null);
    try {
      const results = await generateProteins(request);
      setCandidates(results);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setCandidates([]);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 p-2 rounded-lg">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">HelixGen</h1>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Generative Biology Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Lab Integration</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-500 text-xs">System Operational</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {appState === AppState.IDLE && (
          <div className="animate-fade-in">
             <div className="text-center mb-12">
               <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                 Accelerate Discovery with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Generative Protein Design</span>
               </h2>
               <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                 Input your target parameters and let our Gemini-powered engine design thousands of novel protein candidates in seconds, reducing R&D cycles from years to weeks.
               </p>
             </div>
             <DesignForm onSubmit={handleDesignSubmit} isLoading={false} />
          </div>
        )}

        {appState === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative w-32 h-32 mb-8">
               <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-blue-500 border-r-emerald-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
               <Dna className="absolute inset-0 m-auto text-slate-600 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Designing Novel Proteins</h3>
            <p className="text-slate-400">Analyzing biological constraints and generating sequences...</p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-lg mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <h3 className="text-red-400 font-bold text-lg mb-2">Generation Failed</h3>
            <p className="text-red-200/70 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === AppState.RESULTS && (
          <ResultsDashboard candidates={candidates} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-auto py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 HelixGen Biosciences. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;