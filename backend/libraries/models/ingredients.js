import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: ""
  }
});

export default ingredientSchema;