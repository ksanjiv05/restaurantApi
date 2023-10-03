import { Document } from "mongoose";
import { DEPARTMENT } from "../config/enums";

export interface ITable extends Document {
  tid: string;
  availableSeats?: number;
  totalSeats: number;
  department: DEPARTMENT | string;
  tableNumber: number;
  isAc: boolean;
  isMerged?: boolean;
  isSifted?: boolean;
  mergeTables?: string[];
}
