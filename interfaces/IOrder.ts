import { Document } from "mongoose";
import { DEPARTMENT, KITCHEN, ORDER_STATUS } from "../config/enums";

export type TableProps = {
  tableId: string;
  tableNumber: string;
  availableSeat: number;
};

type ProductProps = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  allocatedKitchen: string;
  note: string;
};

export interface IOrder extends Document {
  mId: string;
  captainName: string;
  pids: ProductProps[];
  tableIds: TableProps[];
  department: DEPARTMENT;
  // allocatedKitchen: string;
  status: ORDER_STATUS;
  orderValue: number;
  isPaid?: boolean;
  paymentId?: string;
  paymentMode?: "CASH" | "CARD" | "UPI";
  note?: string;
  waiterId?: string;
  waiterName?: string;
  customerName?: string;
  customerMobile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
