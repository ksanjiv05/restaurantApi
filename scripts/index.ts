import { DIRECTOR } from "../config/config";
import logging from "../config/logging";
import User from "../models/User";

export const createRootUser = async (
  {
    username = "9999999999",
    staffRole = DIRECTOR,
    mobile = "9999999999",
    password = "Test@1234",
    name = "Root User",
  },
  rest
) => {
  try {
    User.register(
      { username, mobile, name, staffRole, ...rest },
      password,
      function (err, user) {
        if (err) {
          logging.error("Add User", "unable to add user", err);
        }
        console.log("user", user);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
