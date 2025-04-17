import { AIFactory } from '../../../libraries/services/ai-service/aiFactory.js';

import { uploadToFirebase,decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { logUserImageUpload } from '../db.js';

export const analyzeImageIngredients = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return uploadToFirebase(req.file).then(imageUrl => ({ uid, imageUrl }));
    })
    .then(({ uid, imageUrl }) => {
      console.log("ready for base64");
      const base64 = req.file.buffer.toString('base64').replace(/^data:image\/\w+;base64,/, '');
      const aiService = AIFactory.create('clarifai');
      return aiService.analyzeImage(base64).then(ingredients => ({ uid, imageUrl, ingredients }));
    })
    .then(({ uid, imageUrl, ingredients }) => {
      // Optional: Log the upload to MongoDB
      return logUserImageUpload(uid, imageUrl).then(() => {
        res.status(200).json({ imageUrl, ingredients });
      });
    })
    .catch(err => {
      console.error('Ingredient Analyze error:', err.message);
      res.status(500).json({ error: 'Image analysis failed' });
    });
};
