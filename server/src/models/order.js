import mongoose, { Schema } from "mongoose";
import { Counter } from "./counter.js";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "deliveryPartner",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
    },
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    pickupLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    deliveryPersonLocation: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      address: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ["available", "confirmed", "arriving", "delivered", "cancelled"],
      default: "available",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

async function getNextSequanceValue(sequanceNumber) {
  const sequancedoc = await Counter.findOneAndUpdate(
    { name: sequanceNumber },
    { $inc: { sequanceValue: 1 } },
    { new: true, upsert: true }
  );
  return sequancedoc.sequanceValue;
}

orderSchema.pre("save", async function (next) {
  // Use a regular function here
  if (this.isNew) {
    // Now `this` refers to the document instance
    const seqval = await getNextSequanceValue("orderId");
    this.orderId = `ORDR${seqval.toString().padStart(5, "0")}`;
  }
  next();
});

export const Order = mongoose.model("order", orderSchema);
