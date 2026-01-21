import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini Client
// In a real production app, you would proxy this or handle keys more securely.
// For this pitch deck demo, we use the env variable as instructed.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const generateCyclingCommentary = async (
  playerName: string,
  performance: 'fast' | 'steady' | 'struggling'
): Promise<string> => {
  try {
    const prompt = `
      You are a legendary cycling commentator for the Tour de France.
      Write a very short (2 sentences), high-energy commentary for a rider named ${playerName}.
      They are currently performing in a ${performance} manner.
      Mention Tissot precision timing in the commentary.
      Do not use emojis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Tissot: Precision when it matters most.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Tissot tracks every second for ${playerName}. Precision is key.`;
  }
};

export const generateCyclingAudio = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Fenrir has a deep, commentator-like quality
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return undefined;
  }
};
