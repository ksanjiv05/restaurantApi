import { Document } from "mongoose";
import { PRODUCT_CATEGORIES, PRODUCT_QUALITIES } from "../config/enums";

export interface IFoodProduct extends Document {
  name: string;
  image: string;
  code: string;
  isVeg: boolean;
  category: string;
  subCategory: string;
  price: number;
  isReadyToServe?: boolean;
  tag?: string; //bestseller
  isAvailable?: boolean;
  expiryDate?: string;
}
