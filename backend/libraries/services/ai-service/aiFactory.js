import { ClarifaiVisionService } from './clarifaiService.js';

export class AIFactory {
    /**
     * Return the desired AI vision service instance.
     * @param {string} type - 'clarifai' or 'google'
     * @returns {BaseAIService}
     */
    static create(type) {
      const service = type?.toLowerCase();
  
      if (service === 'clarifai') {
        return new ClarifaiVisionService(process.env.CLARIFAI_API_KEY);
      }
  

  
      throw new Error(`Unsupported AI vision service: ${type}`);
    }
}
