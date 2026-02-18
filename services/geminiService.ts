
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, TimeOfDay, VerseData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchVerse = async (mood: Mood, timeOfDay: TimeOfDay): Promise<VerseData> => {
  const prompt = `Provide a powerful Bible verse specifically for a woman's "elevation" journey.
  Mandatory Requirements:
  - BIBLE VERSION: Use ONLY "NKJV" (English) or "LSG 1910" (French). Do not use other versions.
  - CONTEXT: Mood is ${mood}, Time is ${timeOfDay}.
  - THEME: Strength, growth, grace, and divine authority.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are an empowering spiritual mentor. Your output must be ONLY a JSON object. You must respect the requested Bible versions (NKJV or LSG 1910). Your tone is bold, minimalist, and proper.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The Bible verse text (NKJV or LSG 1910).",
          },
          reference: {
            type: Type.STRING,
            description: "The book, chapter, and verse reference.",
          },
          reflection: {
            type: Type.STRING,
            description: "A short, one-sentence empowering reflection.",
          },
        },
        required: ["text", "reference", "reflection"],
      },
    },
  });

  try {
    return JSON.parse(response.text || '{}') as VerseData;
  } catch (error) {
    console.error("Failed to parse verse data", error);
    return {
      text: "God is in the midst of her, she shall not be moved; God shall help her, just at the break of dawn.",
      reference: "Psalm 46:5 (NKJV)",
      reflection: "You are unshakable because the Divine is within you."
    };
  }
};
