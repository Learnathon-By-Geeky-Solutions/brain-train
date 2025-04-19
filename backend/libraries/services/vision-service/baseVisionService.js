export class BaseVisionService {
  async analyzeImage(_base64Image) {
    throw new Error("analyzeImage() must be implemented by subclass");
  }
}
