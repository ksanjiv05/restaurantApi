import { Document } from "mongoose";

export interface IKitchen extends Document {
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
