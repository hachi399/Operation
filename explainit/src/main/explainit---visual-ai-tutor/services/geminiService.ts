
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiExplanationResponse } from "../types";

// API キーを環境変数またはハードコード値から取得
const apiKey = (import.meta.env.VITE_API_KEY as string)||  "AIzaSyBfHCdf-4JvmrFCrExU3BdU0f99xlZJxX4" || '';
const ai = new GoogleGenAI({ apiKey });

export async function getExplanation(topic: string): Promise<GeminiExplanationResponse> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain "${topic}" in a simple way for a student. Provide a clear text explanation and a detailed visual prompt for an image generator to create a helpful diagram or illustration that clarifies the concept.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: {
            type: Type.STRING,
            description: 'A detailed text explanation of the concept.',
          },
          visualPrompt: {
            type: Type.STRING,
            description: 'A prompt for an image generator to create an illustrative picture.',
          },
        },
        required: ["explanation", "visualPrompt"],
      },
    },
  });

  try {
    const jsonStr = response.text?.trim() || '';
    if (!jsonStr) throw new Error('Empty response');
    return JSON.parse(jsonStr) as GeminiExplanationResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return {
      explanation: response.text || "Sorry, I couldn't generate an explanation.",
      visualPrompt: topic
    };
  }
}

export async function generateVisualImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Educational illustration for: ${prompt}. Clean, professional, informative, high quality, digital art style.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data found in response");
}
