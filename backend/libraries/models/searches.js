import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now(),
  },
});

export default searchSchema;
