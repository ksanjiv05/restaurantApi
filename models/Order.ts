import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IOrder } from "../interfaces/IOrder";

const OrderSchema: Schema = new Schema({
  pids: [
    {
      type: String,
      required: true,
    },
  ],
  kid: {
    type: String,
    required: true,
  },
  mId: {
    type: String,
    required: true,
  },
  tableId: {
    type: String,
    required: true,
  },
  customerName: String,
  customerMobile: String,
  department: {
    type: String,
    required: true,
  },
  allocatedKitchen: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  orderValue: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentId: String,
  paymentMode: String,
  captainId: String,
  waitingTime: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.pre<IOrder>("save", async function (next) {
  next();
});

OrderSchema.post<IOrder>("save", function () {
  logging.info("Mongo", "New Order just added: ");
});

export default mongoose.model<IOrder>("Order", OrderSchema);
