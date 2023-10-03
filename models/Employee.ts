import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IEmployee } from "../interfaces/IEmployee";

const EmployeeSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  // isCafe:{
  //   type: String,
  //   required: true,
  // },
  skill: {
    type: Number,
  },
  payScale: {
    type: Number,
    required: true,
  },
  workingHours: {
    type: Number,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  maxQulification: {
    type: String,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  inLeave: {
    type: Boolean,
  },
  rating: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

EmployeeSchema.pre<IEmployee>("save", async function (next) {
  next();
});

EmployeeSchema.post<IEmployee>("save", function () {
  logging.info("Mongo", "New Employee just added: ");
});

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
