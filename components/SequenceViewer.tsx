import React from 'react';

interface SequenceViewerProps {
  sequence: string;
}

// Simple color coding for amino acids based on properties
const getAAColor = (aa: string) => {
  const polar = ['R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'K', 'S', 'T', 'Y'];
  const nonPolar = ['A', 'F', 'I', 'L', 'M', 'P', 'V', 'W'];
  
  if (['K', 'R', 'H'].includes(aa)) return 'bg-blue-500/40 text-blue-200 border-blue-500/50'; // Basic (+)
  if (['D', 'E'].includes(aa)) return 'bg-red-500/40 text-red-200 border-red-500/50'; // Acidic (-)
  if (polar.includes(aa)) return 'bg-emerald-500/40 text-emerald-200 border-emerald-500/50'; // Polar
  return 'bg-slate-600/40 text-slate-300 border-slate-500/50'; // Non-polar
};

export const SequenceViewer: React.FC<SequenceViewerProps> = ({ sequence }) => {
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 overflow-x-auto">
      <div className="flex flex-wrap gap-1">
        {sequence.split('').map((aa, i) => (
          <div 
            key={i} 
            className={`
              w-8 h-8 flex items-center justify-center rounded 
              font-mono text-xs font-bold border
              ${getAAColor(aa)}
              hover:scale-110 transition-transform cursor-default
            `}
            title={`Position ${i+1}: ${aa}`}
          >
            {aa}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-500 font-mono">
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Basic (+)</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Acidic (-)</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Polar</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-500"></div> Hydrophobic</div>
      </div>
    </div>
  );
};