import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IUser } from "../interfaces/IUser";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  alternateMobile: {
    type: String,
  },
  shift: {
    type: String,
    // required: true,
  },
  staffRole: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  aadhar: {
    type: String,
  },
  department: {
    type: String,
  },
  checkIn: {
    type: String,
  },
  checkOut: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  permissions: [
    {
      permissionType: {
        type: String,
      },
      permissionArray: {
        type: [String],
      },
    },
  ],
  updateAt: {
    type: String,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const salt = 10;

UserSchema.pre<IUser>("save", async function (next) {
  const user = this;
  next();
});

UserSchema.post<IUser>("save", function () {
  logging.info("Mongo", "New user just saved: ");
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model<IUser>("User", UserSchema);
