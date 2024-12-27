import mongoose, { Schema } from "mongoose";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  liveLocation: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  address: {
    type: String,
  },
  DeliveryPartners:[

    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"deliveryPartner"
    }
  ]
});
export const Branch =  mongoose.model("branch",branchSchema)
