import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IInventory } from "../interfaces/IInventory";

const InventorySchema: Schema = new Schema({
  image:{
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  productModel: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: false,
    // set: function() {
    //   console.log("this ",this)
    //   return this?.quantity>1 }
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  expiration: {
    type: String,
    required: true,
  },
  

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

InventorySchema.index({title:1,brand:1,productModel:1,supplier:1},{unique:true})

InventorySchema.pre<IInventory>("save", async function (next) {
  next();
});

InventorySchema.post<IInventory>("save", function () {
  logging.info("Mongo", "New Inventory just added: ");
});

export default mongoose.model<IInventory>("Inventory", InventorySchema);
