
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, TimeOfDay, VerseData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchVerse = async (mood: Mood, timeOfDay: TimeOfDay): Promise<VerseData> => {
  const prompt = `Provide a powerful, uplifting Bible verse specifically curated for a woman aiming to "elevate" herself this year. 
  The selection should be based on the following context:
  - User's Current Mood: ${mood}
  - Time of Day: ${timeOfDay}
  Focus on themes of strength, grace, wisdom, and spiritual growth.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are a spiritual mentor focusing on empowering women through biblical wisdom. Your tone is minimalistic, bold, and encouraging. Return ONLY JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The full text of the Bible verse.",
          },
          reference: {
            type: Type.STRING,
            description: "The book, chapter, and verse (e.g., Genesis 1:1).",
          },
          reflection: {
            type: Type.STRING,
            description: "A very short, one-sentence empowering reflection for a modern woman.",
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
      text: "The Lord is my light and my salvation; whom shall I fear?",
      reference: "Psalm 27:1",
      reflection: "Walk in confidence today, knowing you are protected and guided."
    };
  }
};
