import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IKitchen } from "../interfaces/IKitchen";

const KitchenSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Kitchen name is required"],
  },
  type: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

KitchenSchema.pre<IKitchen>("save", async function (next) {
  next();
});

KitchenSchema.post<IKitchen>("save", function () {
  logging.info("Mongo", "New Kitchen just added: ");
});

export default mongoose.model<IKitchen>("Kitchen", KitchenSchema);
