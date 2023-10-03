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
  kid:{
    type: String,
    required : true,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  tableId: {
    type: String,
  },
  customerId: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  cafeId: {
    type: String,
    // required: true,
  },
  waiterId: String,
  waitingTime: String,
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


