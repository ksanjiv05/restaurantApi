import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { INotification } from "../interfaces/INotification";

const NotificationSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "Notification name is required"],
  },
  id: String, //regarding Order Inventory or Kitchen
  action: String,
  remark: String,
  actionPerformedBy: String,
  actionPerformedId: String,
  type: String,
  isActive: Boolean,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

NotificationSchema.pre<INotification>("save", async function (next) {
  next();
});

NotificationSchema.post<INotification>("save", function () {
  logging.info("Mongo", "New Notification just added: ");
});

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
