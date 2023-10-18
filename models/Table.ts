import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { ITable } from "../interfaces/ITable";

const TableSchema: Schema = new Schema({
  tid: {
    type: String,
    required: true,
    unique: true,
  },
  totalSeats: {
    type: Number,
    required: [true, "Total  occupancy is required"],
  },
  occupiedSeat: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return this.totalSeats <= v;
      },
      message: (props) => `seat not avilable!`,
    },
  },
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  tableNumber: {
    type: Number,
    required: [true, "Table number is required"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
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

// TableSchema.pre('updateOne', { document: true, query: false })

TableSchema.post<ITable>("save", function () {
  logging.info("Mongo", "New Table just added: ");
});

export default mongoose.model<ITable>("Table", TableSchema);
