import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { ICustomer } from "../interfaces/ICustomer";

const CustomerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


CustomerSchema.pre<ICustomer>("save", async function (next) {
  next();
});

CustomerSchema.post<ICustomer>("save", function () {
  logging.info("Mongo", "New Customer just added: ");
});

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
