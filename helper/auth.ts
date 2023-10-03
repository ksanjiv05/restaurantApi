import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";

export async function getHashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return hash;
}

export const getToken = function (user) {
  // This helps us to create the JSON Web Token
  return jwt.sign(user, SECRET_KEY, { expiresIn: 3600 });
};
