import { GeminiService } from "./geminiService.js";

export class ChatFactory {
  static create(provider) {
    const service = provider?.toLowerCase();
    if (service === "gemini") {
      return new GeminiService(process.env.GEMINI_API_KEY);
    } else {
      throw new Error("Unsupported LLM provider");
    }
  }
}
