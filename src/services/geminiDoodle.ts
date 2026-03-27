import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Doodle {
  message: string;
  icon: string;
  color: string;
}

export async function getAiDoodle(): Promise<Doodle | null> {
  try {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    
    const prompt = `Today is ${dateStr}. Is it a special day (holiday, festival, international day, or a significant event)? 
    If yes, create a short, cheerful greeting (max 30 chars). 
    Choose a Lucide icon name from this list: Gift, Heart, Star, PartyPopper, Flower2, TreePine, Cake, Sun, Moon, Cloud, Zap, Sparkles, Smile, Coffee.
    Choose a vibrant hex color that matches the mood.
    If it is not a special day, return null.
    
    Respond in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSpecial: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            icon: { type: Type.STRING },
            color: { type: Type.STRING }
          },
          required: ["isSpecial"]
        }
      }
    });

    const result = JSON.parse(response.text);
    if (result.isSpecial) {
      return {
        message: result.message,
        icon: result.icon,
        color: result.color
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching AI doodle:", error);
    return null;
  }
}
