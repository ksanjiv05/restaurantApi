import { Document } from "mongoose";
import { KITCHEN } from "../config/enums";

export interface IInventory extends Document {
  image: string;
  name: string;
  description: string;
  brand: string;
  quantity: number;
  price: number;
  supplier: string;
  expiration: string;
  inStock: boolean;
  kitchen: KITCHEN;
  createdAt: string;
  updatedAt: Date;
}
