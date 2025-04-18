export class BaseAIService {
  async analyzeImage() {
    throw new Error("analyzeImage() must be implemented by subclass");
  }
}
