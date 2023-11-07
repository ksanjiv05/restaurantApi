import { Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  id: string; //regarding Order Inventory or Kitchen
  action: string;
  remark: string;
  actionPerformedBy: string;
  actionPerformedId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
