import { Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  orderId: string;
  action: string;
  remark: string;
  actionPerformedBy: string;
  actionPerformedId: string;
  createdAt: Date;
  updatedAt: Date;
}
