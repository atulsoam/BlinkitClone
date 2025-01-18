import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: "mainCategory" },
});
const categoryMainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
});
export const Category = mongoose.model("category", categorySchema);
export const MainCategory = mongoose.model("mainCategory", categoryMainSchema);
