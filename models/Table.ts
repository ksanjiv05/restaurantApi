import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { ITable } from "../interfaces/ITable";

const TableSchema: Schema = new Schema({
  tid: {
    type: String,
    required: true,
    unique: true,
  },
  availableSeats: {
    type: Number,
  },
  totalSeats: {
    type: Number,
    required: [true, "Total  occupancy is required"],
  },
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  tableNumber: {
    type: Number,
    required: [true, "Table number is required"],
  },
  isAvailable:{
    type:Boolean,
    default:true
  },
  isAc: {
    type: Boolean,
    required: true,
  },
  isMerged: {
    type: Boolean,
    default: false,
  },
  isSifted: {
    type: Boolean,
    default: false,
  },
  mergeTables: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TableSchema.index({ department: 1, tableNumber: 1 }, { unique: true });

TableSchema.pre<ITable>("save", async function (next) {
  next();
});

TableSchema.post<ITable>("save", function () {
  logging.info("Mongo", "New Table just added: ");
});

export default mongoose.model<ITable>("Table", TableSchema);
