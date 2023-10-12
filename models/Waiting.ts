import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IWaiting } from "../interfaces/IWaiting";

const WaitingSchema: Schema = new Schema({
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

  customerName: String,
  customerMobile: String,
  department: {
    type: String,
    required: [true, "Department is required"],
  },

  status: {
    type: String,
    // enum: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },
  WaitingToken: {
    type: Number,
    required: [false, "Waiting Value is required"],
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

WaitingSchema.pre<IWaiting>("save", async function (next) {
  next();
});

WaitingSchema.post<IWaiting>("save", function () {
  logging.info("Mongo", "New Waiting just added: ");
});

export default mongoose.model<IWaiting>("Waiting", WaitingSchema);
