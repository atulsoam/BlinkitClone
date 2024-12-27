import mongoose, { Schema } from "mongoose";

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  sequanceValue: {
    type:Number,
    default:0
  }
});

const orderSchema = new mongoose.Schema({
    
})
export const Counter =  mongoose.model("counter",counterSchema)
