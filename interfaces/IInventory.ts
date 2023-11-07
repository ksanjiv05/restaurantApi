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
  note: string;
  unit: string;
  expiration: string;
  inStock: string;
  kitchen: KITCHEN[]; ////kitchen allocates to inventory is reffred as order category
  productWiseQuantity: [
    {
      product: string;
      quantity: number;
    }
  ];
  createdAt: string;
  updatedAt: Date;
}
