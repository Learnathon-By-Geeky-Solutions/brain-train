import { BaseAIService } from './baseAIService.js';
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';

export class ClarifaiVisionService extends BaseAIService {
  constructor(apiKey) {
    super();
    this.stub = ClarifaiStub.grpc();
    this.metadata = new grpc.Metadata();
    this.metadata.set("authorization", `Key ${apiKey}`);
  }

  /**
   * Analyze base64 image and extract ingredient names using Clarifai API.
   * @param {string} base64Image
   * @returns {Promise<string[]>}
   */
  async analyzeImage(base64Image) {
    const requestPayload = {
      model_id: 'food-item-recognition',
      inputs: [
        {
          data: {
            image: {
              base64: base64Image
            }
          }
        }
      ]
    };

    const response = await new Promise((resolve, reject) => {
      this.stub.PostModelOutputs(requestPayload, this.metadata, (err, res) => {
        if (err || res?.status?.code !== 10000) {
          const reason = err?.message || res?.status?.description || "Clarifai API error";
          return reject(new Error(reason));
        }
        resolve(res);
      });
    });

    const concepts = response.outputs?.[0]?.data?.concepts || [];
    return concepts.map(c => ({
      name: c.name.toLowerCase(),
      confidence: c.value, // Clarifai returns a float between 0 and 1
    }))
    // .filter(c => c.confidence > 0.1) // Filter out low-confidence results
    ;
    }
}
