export interface ProteinCandidate {
  id: string;
  name: string;
  sequence: string;
  molecularWeight: number; // in kDa
  affinityScore: number; // Predicted Kd in nM (lower is better)
  stabilityScore: number; // 0-100
  foldingConfidence: number; // 0-100
  description: string;
  targetMechanism: string;
}

export interface DesignRequest {
  targetName: string;
  desiredFunction: string;
  constraints: {
    minStability: number;
    maxWeight: number;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
