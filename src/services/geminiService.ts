import { GoogleGenAI, Type } from "@google/genai";
import { VibeMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateBingoItems(mode: VibeMode, customPrompt?: string): Promise<{title: string, items: string[]} | null> {
  const systemInstructions = `
    You are a compassionate art therapist and neurodiversity advocate. 
    Your task is to generate a title and 24 short, validating, and evocative phrases for a 5x5 Bingo grid (the center is a free space, so 24 are needed).
    
    Mode: ${mode}
    Context: ${customPrompt || 'General themes for this mode'}
    
    Constraints:
    - MUST be written in grammatically correct Russian. This is a strict requirement.
    - Each phrase must be 1-4 words.
    - Title must be 1-3 words capturing the current vibe.
    - No Toxic Positivity.
    - Validate feelings (even difficult ones).
    - Use metaphors related to the mode's aesthetic.
    - Return an object with strings "title" and an array of exactly 24 strings "items".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate title and 24 bingo items.",
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            items: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "items"]
        }
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.items && parsed.items.length === 24 && parsed.title) {
        return parsed;
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
