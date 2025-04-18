// /libraries/llms/implementations/GeminiService.js
import { GoogleGenAI } from '@google/genai';
import { BaseChatService } from './baseChatService.js';

export class GeminiService extends BaseChatService {
  constructor() {
    super();
    console.log('GeminiService: Initializing GoogleGenAI with default credentials...');
    this.ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    this.modelName = process.env.GEMINI_MODEL || 'gemini-pro';
    console.log('GeminiService: Model name set to:', this.modelName);
  }

  async sendMessage(messages) {
    const contents = await this.#convertToGeminiFormat(messages);
    console.log('GeminiService: Gemini contents:', JSON.stringify(contents));
    const config = {
      responseMimeType: 'text/plain',
      systemInstruction: [
        {
          text: `You are an AI cooking assistant specializing in food,recipes,ingredients,nutrients and meal plan. Do not chat on unrelated topic and images.
    When user uploads an image without any text instructions,
    1)If the image is about food or recipe,say some details about its name,meal type,cuisine,diet,ready time,serving size,ingredients and nutrition(guess value for calorie,carbs,fat,protein,vitamin,minerals etc).
    (2) If the image contains raw ingredients(like rice,fish,meat etc) ,list all the ingredients and suggest some recipes with these ingredients`,
        }
      ],
    };
    const model = this.modelName;
    console.log('GeminiService: Gemini model:', model);

    try {
      console.log('GeminiService: Sending request to Gemini...');
      const response = await this.ai.models.generateContentStream({
        model,
        config,
        contents,
      });
      console.log('GeminiService: Gemini response received (stream started):', JSON.stringify(response));

      let finalResponse = '';
      for await (const chunk of response) {
        if (chunk && chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content && chunk.candidates[0].content.parts && chunk.candidates[0].content.parts[0] && chunk.candidates[0].content.parts[0].text) {
          const textPart = chunk.candidates[0].content.parts[0].text;
          finalResponse += textPart;
          console.log('GeminiService: Received chunk:', textPart);
        } else {
          console.log('GeminiService: Received chunk (no text):', chunk);
        }
      }
      
      console.log('GeminiService: Final response:', finalResponse);
      return finalResponse;

    } catch (error) {
      console.error('GeminiService: Error during sendMessage:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async #convertToGeminiFormat(messages) {
    return Promise.all(
      messages.map(async ({ role, text, files }) => {
        const parts = [];

        if (text) parts.push({ text });

        if (files?.length) {
          for (const url of files) {
            const base64 = await this.#fetchImageAsBase64(url);
            parts.push({
              inlineData: {
                mimeType: 'image/png', // or dynamic if known
                data: base64,
              },
            });
          }
        }

        return { role, parts };
      })
    );
  }

  async #fetchImageAsBase64(url) {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer).toString('base64');
    } catch (error) {
      console.error('GeminiService: Error fetching image:', error);
      throw error;
    }
  }
}