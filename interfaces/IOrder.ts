import { Document } from "mongoose";
import { DEPARTMENT, KITCHEN, ORDER_STATUS } from "../config/enums";

export interface IOrder extends Document {
  mId: string;
  pids: any[];
  tableIds: string[];
  customerName: string;
  customerMobile: string;
  department: DEPARTMENT;
  allocatedKitchen: KITCHEN;
  status: ORDER_STATUS;
  orderValue: number;
  isPaid?: boolean;
  paymentId?: string;
  paymentMode?: "CASH" | "CARD" | "UPI";
  captainId?: string;
  waitingTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}
