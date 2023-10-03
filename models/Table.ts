import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { ITable } from "../interfaces/ITable";

const TableSchema: Schema = new Schema({
  kid:{
    type:String
  },
  availableSeats: {
    type: Number,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TableSchema.index({kid:1,tableNumber:1},{unique:true})

TableSchema.pre<ITable>("save", async function (next) {
  next();
});

TableSchema.post<ITable>("save", function () {
  logging.info("Mongo", "New Table just added: ");
});

export default mongoose.model<ITable>("Table", TableSchema);
