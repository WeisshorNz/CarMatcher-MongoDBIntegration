import mongoose from "mongoose";

// Car schema
const carSchema = mongoose.Schema({
  body: { type: String },
  model: { type: String },
  make: { type: String },
  color: { type: String },
  year: { type: Number },
  price: { type: Number },
});

// Define & export
export default mongoose.model("Car", carSchema);
