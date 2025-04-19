import mongoose from "mongoose";
import { nutrientSchema } from "./nutrition.js";

const ingredientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: "",
  },
  nutrients: [nutrientSchema],
});

export default ingredientSchema;
