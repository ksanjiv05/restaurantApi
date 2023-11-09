import { Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  id: string; //regarding Order Inventory or Kitchen
  action: string;
  remark: string;
  actionStatus: string;
  actionPerformedBy: string;
  actionPerformedId: string;
  notificationType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
