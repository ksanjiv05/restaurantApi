import {
  ADMIN,
  CAPTAIN,
  CASHIER,
  CREATE,
  DELETE,
  DIRECTOR,
  FB_MANAGER,
  INVENTORY,
  MANAGER,
  OPERATIONAL_MANAGER,
  ORDER,
  READ,
  REPORTS,
  UPDATE,
} from "../config/config";
import logging from "../config/logging";
import User from "../models/User";

export const createRootUser = async (
  {
    username = "9999999999",
    staffRole = DIRECTOR,
    mobile = "9999999999",
    password = "Test@1234",
    name = "Root User",
    permissions = [
      {
        permissionType: CREATE,
        permissionArray: [
          OPERATIONAL_MANAGER,
          FB_MANAGER,
          CASHIER,
          ADMIN,
          MANAGER,
          CAPTAIN,
          ORDER,
          INVENTORY,
          REPORTS,
        ],
      },
      {
        permissionType: UPDATE,
        permissionArray: [
          OPERATIONAL_MANAGER,
          FB_MANAGER,
          CASHIER,
          ADMIN,
          MANAGER,
          CAPTAIN,
          ORDER,
          INVENTORY,
          REPORTS,
        ],
      },
      {
        permissionType: READ,
        permissionArray: [
          OPERATIONAL_MANAGER,
          FB_MANAGER,
          CASHIER,
          ADMIN,
          MANAGER,
          CAPTAIN,
          ORDER,
          INVENTORY,
          REPORTS,
        ],
      },
      {
        permissionType: DELETE,
        permissionArray: [
          OPERATIONAL_MANAGER,
          FB_MANAGER,
          CASHIER,
          ADMIN,
          MANAGER,
          CAPTAIN,
          ORDER,
          INVENTORY,
          REPORTS,
        ],
      },
    ],
    aadhar = "1234567897654",
  },
  rest
) => {
  try {
    User.register(
      { username, mobile, name, permissions, aadhar, staffRole },
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
