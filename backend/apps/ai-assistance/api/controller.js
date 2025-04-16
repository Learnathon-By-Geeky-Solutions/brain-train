import { AIFactory } from '../../../libraries/services/ai-service/aiFactory.js';

const visionService = AIFactory.create('clarifai'); // switch provider here

export const analyzeImageIngredients = async (req, res) => {
  try {
    let { base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: "Missing 'base64Image' in request." });
    }
    base64Image = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const ingredients = await visionService.analyzeImage(base64Image);
    return res.status(200).json({ ingredients });
  } catch (error) {
    console.error("🔍 Vision Analysis Failed:", error.message);
    return res.status(500).json({ error: "Image processing failed." });
  }
};
