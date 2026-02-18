
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, TimeOfDay, VerseData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchVerse = async (mood: Mood, timeOfDay: TimeOfDay): Promise<VerseData> => {
  // Use a timestamp to prevent cached responses from the AI
  const seed = Date.now();
  const prompt = `Provide a unique, powerful Bible verse for a woman's journey of elevation and spiritual growth.
  Context:
  - User Mood: ${mood}
  - Time of Day: ${timeOfDay}
  - Random Seed: ${seed}

  Strict Constraints:
  1. VERSION: Use ONLY NKJV or LSG 1910.
  2. DIVERSITY: Do not repeat the same verses frequently. Look into Proverbs (e.g., Proverbs 31), Psalms, Ruth, Esther, or the Gospels.
  3. CONTENT: Focus on divine identity, strength, and grace.
  4. REFERENCE: Format exactly as "Book Chapter:Verse (Version)" (e.g., Proverbs 31:25 (NKJV)).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are a spiritual mentor. Provide high-quality JSON data. Ensure the verse text is exactly as written in NKJV or LSG 1910.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          reference: { type: Type.STRING },
          reflection: { type: Type.STRING },
        },
        required: ["text", "reference", "reflection"],
      },
    },
  });

  try {
    return JSON.parse(response.text || '{}') as VerseData;
  } catch (error) {
    return {
      text: "Strength and honor are her clothing; she shall rejoice in time to come.",
      reference: "Proverbs 31:25 (NKJV)",
      reflection: "Your future is bright because your strength comes from within."
    };
  }
};
