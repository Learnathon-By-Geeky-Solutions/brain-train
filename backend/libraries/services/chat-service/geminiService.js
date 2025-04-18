import genAI from '@google/genai';
import { BaseChatService } from './baseChatService.js';
import mime from 'mime';
const { GoogleGenAI, toFile } = genAI;


export class GeminiService extends BaseChatService {
  constructor(apiKey) {
    super();
    this.ai = new GoogleGenAI({ apiKey });
    this.model = this.ai.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      systemInstruction: `You are an AI cooking assistant specializing in food, recipes, ingredients, nutrients, and meal planning. 
Do not chat on unrelated topics.
1) If image is of food, provide meal type, cuisine, ingredients, nutrients.
2) If image contains ingredients, list them and suggest recipes.`
    });
  }

  async sendMessage(messages) {
    const formatted = await this.#convertToGeminiFormat(messages);
    const response = await this.model.generateContent({
      contents: formatted,
    });
    return response.response.text();
  }

  async #convertToGeminiFormat(messages) {
    return Promise.all(messages.map(async (msg) => {
      const parts = [];
      if (msg.text) parts.push({ text: msg.text });

      if (msg.files && msg.files.length > 0) {
        const imageUrl = msg.files[0];
        const fileExt = imageUrl.split('.').pop();
        const mimeType = mime.getType(fileExt);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = await toFile(blob, 'image.' + fileExt, { type: mimeType });
        parts.push({ inlineData: { data: await file.arrayBuffer(), mimeType } });
      }

      return {
        role: msg.role,
        parts,
      };
    }));
  }
}
