import { GeminiService } from "./geminiService.js";

export class ChatFactory {
  static create(provider) {
    if (provider === "gemini") {
      return new GeminiService(process.env.GEMINI_API_KEY);
    } else {
      throw new Error("Unsupported LLM provider");
    }
  }
}
