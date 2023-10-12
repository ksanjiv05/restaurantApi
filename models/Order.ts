import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IOrder } from "../interfaces/IOrder";

const OrderSchema: Schema = new Schema({
  pids: {
    type: [],
    validate: {
      validator: function (v: any[]) {
        return v.length > 0;
      },
      message: () => `product id is required!`,
    },
    // required: [true, "Product Id is required"],
  },

  mId: {
    type: String,
    required: [true, "Manager Id is required"],
  },
  managerName: {
    type: String,
    required: [true, "Manager name is required"],
  },
  tableIds: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.length > 0;
      },
      message: () => `table id is required!`,
    },
  },
  customerName: String,
  customerMobile: String,
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  allocatedKitchen: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },
  orderValue: {
    type: Number,
    required: [true, "Order Value is required"],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentId: String,
  paymentMode: String,
  captainId: String,
  WaitingToken: {
    type: Number,
    default: 0,
  },
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
