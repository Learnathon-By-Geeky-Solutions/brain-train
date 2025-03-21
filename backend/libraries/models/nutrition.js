import mongoose from "mongoose";

const nutrientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0.0
  },
  unit: {
    type: String,
    default: ""
  },
  percentOfDailyNeeds: {
    type: Number,
    default: 0.0
  }
});

const nutritionPropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0.0
  },
  unit: {
    type: String,
    default: ""
  }
});

const nutritionSchema = new mongoose.Schema({
  nutrients: [nutrientSchema],
  properties: [nutritionPropertySchema]
});

export { 
  nutritionPropertySchema,
  nutrientSchema,
  nutritionSchema
}; 