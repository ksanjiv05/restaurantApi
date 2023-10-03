import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { ISupplier } from "../interfaces/ISupplier";

const SupplierSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

SupplierSchema.index({ kid: 1, SupplierNumber: 1 }, { unique: true });

SupplierSchema.pre<ISupplier>("save", async function (next) {
  next();
});

SupplierSchema.post<ISupplier>("save", function () {
  logging.info("Mongo", "New Supplier just added: ");
});

export default mongoose.model<ISupplier>("Supplier", SupplierSchema);
