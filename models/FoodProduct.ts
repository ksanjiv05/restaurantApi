import mongoose, { Schema } from "mongoose";
import logging from "../config/logging";
import { IFoodProduct } from "../interfaces/IFoodProduct";

const FoodProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    lowercase: true,
  },
  image: {
    type: String,
  },
  code: {
    type: String,
    required: [true, "Product code is required"],
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    lowercase: true,
    default: "unknown",
  },
  subCategory: {
    type: String,
    lowercase: true,
    default: "unknown",
  },

  price: [
    {
      department: String,
      price: Number,
    },
  ],
  isReadyToServe: {
    type: Boolean,
    default: false,
  },
  tag: String,
  isAvailable: Boolean,
  expiryDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
FoodProductSchema.index(
  { name: 1, isVeg: 1, price: 1, department: 1 },
  { unique: true }
);
FoodProductSchema.index({ name: "text", description: "text" });

FoodProductSchema.pre<IFoodProduct>("save", async function (next) {
  next();
});

FoodProductSchema.post<IFoodProduct>("save", function () {
  logging.info("Mongo", "New Product just saved: ");
});

export default mongoose.model<IFoodProduct>("FoodProduct", FoodProductSchema);
