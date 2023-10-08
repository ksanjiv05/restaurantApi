import { Document } from "mongoose";
import { DEPARTMENT, KITCHEN, ORDER_STATUS } from "../config/enums";

export interface IWaiting extends Document {
  mId: string;
  pids: any[];
  //tableIds: string[];
  customerName: string;
  customerMobile: string;
  department: DEPARTMENT;
  //   allocatedKitchen: KITCHEN;
  status: ORDER_STATUS;
  WaitingToken: number;
  orderValue: number;
  createdAt?: Date;
  updatedAt?: Date;
}
