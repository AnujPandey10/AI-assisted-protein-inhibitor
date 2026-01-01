import { GoogleGenAI, Type } from "@google/genai";
import { DesignRequest, ProteinCandidate } from "../types";
import { calculateMolecularWeight, calculateStabilityScore, validateSequence } from "../utils/biophysics";

// Initialize Gemini Client
// Note: API key is pulled from environment variables as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProteins = async (request: DesignRequest): Promise<ProteinCandidate[]> => {
  const modelId = "gemini-3-flash-preview"; 

  const prompt = `
    You are an expert computational biologist and protein design AI.
    Your task is to de novo design novel protein sequences to address a specific drug discovery challenge.
    
    Target: ${request.targetName}
    Desired Mechanism: ${request.desiredFunction}
    Constraints: 
    - Minimum Stability Score: ${request.constraints.minStability}/100
    - Maximum Molecular Weight: ${request.constraints.maxWeight} kDa

    Generate 6 distinct novel protein candidates that meet these criteria. 
    For each candidate, provide a plausible sequence (using standard amino acid codes), a scientific name, estimated molecular weight, predicted binding affinity (Kd in nM), a stability score, a folding confidence score, and a brief mechanism of action description.
    
    Ensure the sequences look biologically plausible for short proteins/peptides or mini-proteins (approx 20-100 AA).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              sequence: { type: Type.STRING },
              molecularWeight: { type: Type.NUMBER },
              affinityScore: { type: Type.NUMBER, description: "Dissociation constant (Kd) in nM" },
              stabilityScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
              foldingConfidence: { type: Type.NUMBER, description: "AlphaFold pLDDT equivalent score 0-100" },
              description: { type: Type.STRING },
              targetMechanism: { type: Type.STRING }
            },
            required: ["name", "sequence", "molecularWeight", "affinityScore", "stabilityScore", "foldingConfidence", "description", "targetMechanism"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Process and validate candidates with biophysics engine
    return data
      .filter((item: any) => validateSequence(item.sequence)) // Filter invalid sequences
      .map((item: any, index: number) => {
        // Overwrite hallucinated values with calculated ones
        const calculatedWeight = calculateMolecularWeight(item.sequence);
        const calculatedStability = calculateStabilityScore(item.sequence);

        return {
          ...item,
          id: `cand-${Date.now()}-${index}`,
          molecularWeight: calculatedWeight,
          stabilityScore: calculatedStability,
          // Add a flag to indicate these are verified values
          verificationStatus: "CALCULATED"
        };
      });

  } catch (error) {
    console.error("Gemini Protein Generation Error:", error);
    throw new Error("Failed to generate protein designs. Please check your inputs and try again.");
  }
};
