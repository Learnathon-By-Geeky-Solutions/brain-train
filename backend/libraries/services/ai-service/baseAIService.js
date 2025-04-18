export class BaseAIService {
    async analyzeImage(base64Image) {
      throw new Error("analyzeImage() must be implemented by subclass");
    }
  }
  