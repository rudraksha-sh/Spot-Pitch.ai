
import { GoogleGenAI, Type } from "@google/genai";
import type { PitchData } from '../types';

// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
// This variable is assumed to be pre-configured in the execution environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    elevatorPitch: {
      type: Type.STRING,
      description: "A short, compelling paragraph summarizing the business idea. (2-4 sentences)",
    },
    slideBullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 to 5 key bullet points for a pitch deck slide, highlighting the main features or benefits.",
    },
    tagline: {
      type: Type.STRING,
      description: "A catchy, one-sentence slogan for the business.",
    },
    valueProposition: {
      type: Type.STRING,
      description: "A clear statement on the unique value and benefits the product/service offers to customers. (2-3 sentences)",
    },
    competitors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 to 5 potential competitors, both direct and indirect.",
    },
    revenueModels: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2 to 3 possible ways the business could make money (e.g., 'Subscription fees', 'Direct sales').",
    },
  },
  required: ['elevatorPitch', 'slideBullets', 'tagline', 'valueProposition', 'competitors', 'revenueModels'],
};


export const generatePitch = async (idea: string): Promise<PitchData> => {
  const prompt = `
    Based on the following startup idea, generate a comprehensive business pitch.
    
    Idea:
    ---
    ${idea}
    ---
    
    Generate the output in the format specified by the JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert startup advisor and business strategist. Your goal is to help aspiring entrepreneurs flesh out their ideas into a structured business pitch. Be concise, insightful, and use business-appropriate language.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedData: PitchData = JSON.parse(jsonText);
    
    return parsedData;

  } catch (error) {
    console.error("Error generating pitch from Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
