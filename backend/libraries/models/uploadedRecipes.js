import mongoose from "mongoose";

const uploadedRecipesSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      default: '' 
    },
    likes: {
      type: Number,
      default: 0
    }
  },
);

const UploadedRecipe = mongoose.model('UploadedRecipe', uploadedRecipesSchema);

export default UploadedRecipe;
