import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IInventory } from "../interfaces/IInventory";

const InventorySchema: Schema = new Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  brand: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  supplier: {
    type: String,
  },
  expiration: {
    type: String,
  },
  inStock: Boolean,
  kitchen: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
});

InventorySchema.index({ name: 1, brand: 1 }, { unique: true });

InventorySchema.pre<IInventory>("save", async function (next) {
  next();
});

InventorySchema.post<IInventory>("save", function () {
  logging.info("Mongo", "New Inventory just added: ");
});

export default mongoose.model<IInventory>("Inventory", InventorySchema);
