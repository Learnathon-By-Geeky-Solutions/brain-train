// /libraries/llms/implementations/GeminiService.js
import { GoogleGenAI } from "@google/genai";
import { BaseChatService } from "./baseChatService.js";

export class GeminiService extends BaseChatService {
  constructor(GEMINI_API_KEY) {
    super();
    this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    this.modelName = process.env.GEMINI_MODEL || "gemini-pro";
  }

  async sendMessage(contents) {
    const config = {
      responseMimeType: "text/plain",
      systemInstruction: [
        {
          text: `You are an AI cooking assistant specializing in food,recipes,ingredients,nutrients and meal plan. Do not chat on unrelated topic and images.
    When user uploads an image without any text instructions,
    1)If the image is about food or recipe,say some details about its name,meal type,cuisine,diet,ready time,serving size,ingredients and nutrition(guess value for calorie,carbs,fat,protein,vitamin,minerals etc).
    (2) If the image contains raw ingredients(like rice,fish,meat etc) ,list all the ingredients and suggest some recipes with these ingredients`,
        },
      ],
    };
    const model = this.modelName;

    try {
      const response = await this.ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let finalResponse = "";
      for await (const chunk of response) {
        const textPart = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textPart) {
          finalResponse += textPart;
        }
      }

      return finalResponse;
    } catch (error) {
      throw new Error(
        "GeminiService: Error during sendMessage{" + error.message + "}",
      );
    }
  }
}
