import { Document } from "mongoose";
import { DEPARTMENT, KITCHEN, ORDER_STATUS } from "../config/enums";

export type TableProps = {
  tableId: string;
  tableNumber: number;
  availableSeat: number;
};

type ProductProps = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  allocatedKitchen: string;
};

export interface IOrder extends Document {
  mId: string;
  captainName: string;
  pids: ProductProps[];
  tableIds: TableProps[];
  department: DEPARTMENT;
  // allocatedKitchen: KITCHEN;
  status: ORDER_STATUS;
  orderValue: number;
  isPaid?: boolean;
  paymentId?: string;
  paymentMode?: "CASH" | "CARD" | "UPI";
  waiterId?: string;
  waiterName?: string;
  customerName?: string;
  customerMobile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
