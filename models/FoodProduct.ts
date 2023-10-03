import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IFoodProduct } from "../interfaces/IFoodProduct";
import { PRODUCT_CATEGORIES } from "../config/enums";

const FoodProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  category: {
    type: Number,
    required: true,
    default:PRODUCT_CATEGORIES.UNKNOWN
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  isReadyToServe: {
    type: Boolean,
    default: false,
  },
  rating: Number,
  tag: String,
  isAvailable:Boolean,
  expiryDate:{
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


FoodProductSchema.pre<IFoodProduct>("save", async function (next) {
  next();
});

FoodProductSchema.post<IFoodProduct>("save", function () {
  logging.info("Mongo", "New Product just saved: ");
});

export default mongoose.model<IFoodProduct>("FoodProduct", FoodProductSchema);
