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
  minQuantityToNotification: number;
  kitchen: KITCHEN[]; ////kitchen allocates to inventory is reffred as order category
  kitchenWiseQuantity: [
    {
      product: string;
      productId: string;
      quantity: number;
    }
  ];
  createdAt: string;
  updatedAt: Date;
}
