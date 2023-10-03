import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IKitchan } from "../interfaces/IKitchan";

const KitchanSchema: Schema = new Schema({
  kid:{  //combination name time and random string
    type: String,
    required: true,
    unique: true,
  },
  resturantName:{
    type: String,
    required: true,
  },
  kName:{
    type: String,
    required: true,
  },
  cafes: [
    {
      id: {
        type: String,
        required: true,
      },
      skill:{
        type: String,
        required: true,
      },
      assignedOrders: [],
    },
  ],
  waiters: [
    {
      id: {
        type: String,
        required: true,
      },
      skill:{
        type: Number,
        default:-1
      },
      assignedOrders: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

KitchanSchema.index({kName:1,resturantName:1},{unique:true})

KitchanSchema.pre<IKitchan>("save", async function (next) {
  next();
});

KitchanSchema.post<IKitchan>("save", function () {
  logging.info("Mongo", "New Kitchan just added: ");
});

export default mongoose.model<IKitchan>("Kitchan", KitchanSchema);
