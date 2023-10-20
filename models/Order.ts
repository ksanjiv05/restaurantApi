import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IOrder } from "../interfaces/IOrder";

const OrderSchema: Schema = new Schema({
  pids: {
    type: [
      {
        productId: String,
        productName: String,
        quantity: Number,
        price: Number,
        allocatedKitchen: String,
      },
    ],
    validate: {
      validator: function (v: any[]) {
        return v.length > 0;
      },
      message: () => `product id is required!`,
    },
  },

  cId: {
    type: String,
    required: [true, "Manager Id is required"],
  },
  captainName: {
    type: String,
    required: [true, "Manager name is required"],
  },
  tableIds: {
    type: [
      {
        tableId: String,
        tableNumber: String,
        availableSeat: Number,
      },
    ],
    validate: {
      validator: function (v: string[]) {
        return v.length > 0;
      },
      message: () => `table id is required!`,
    },
  },
  note: String,
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  // allocatedKitchen: {
  //   type: String,
  //   required: [true, "Kitchen is required"],
  // },
  status: {
    type: String,
    default: "PLACED",
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
  waiterId: {
    type: String,
    required: [true, "waiter Id is required"],
  },
  waiterName: {
    type: String,
    required: [true, "waiter name is required"],
  },

  customerName: String,
  customerMobile: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.index({ managerName: "text", mId: "text" });

OrderSchema.pre<IOrder>("save", async function (next) {
  next();
});

OrderSchema.post<IOrder>("save", function () {
  logging.info("Mongo", "New Order just added: ");
});

export default mongoose.model<IOrder>("Order", OrderSchema);
