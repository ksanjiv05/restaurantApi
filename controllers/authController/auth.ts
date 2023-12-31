import { Request, Response } from "express";
import logging from "../../config/logging";
import User from "../../models/User";
import { IUser } from "../../interfaces/IUser";
import { responseObj } from "../../helper/response";
import { HTTP_RESPONSE } from "../../helper/constants";
import { getHashPassword, getToken } from "../../helper/auth";
import { hasPermission } from "../../helper/check_permission";
import { CAPTAIN } from "../../config/config";
import roles from "../../config/roles";
import { DEPARTMENT } from "../../config/enums";

export const addUser = async (req: Request, res: Response) => {
  try {
    const {
      name = "",
      mobile = "",
      password = "",
      staffRole = "",
      department = "",
      shift = "",
    }: IUser = req.body;

    if (name == "" || mobile == "" || password == "" || staffRole == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Name, mobile,staff role and password are required",
        error: null,
        resObj: res,
        data: null,
      });
    }

    if (staffRole === CAPTAIN && department == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Department is required",
        error: null,
        resObj: res,
        data: null,
      });
    }
    if (staffRole === CAPTAIN && shift == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "shift is required",
        error: null,
        resObj: res,
        data: null,
      });
    }

    // console.log("req.user", req.user);
    // const authorized_user_role = req.user?.staffRole;
    // if (!hasPermission(authorized_user_role, "CREATE", staffRole)) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.UNAUTHORIZED,
    //     type: "error",
    //     msg: "Have no permission to create user with this role",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    // const hashPassword = await getHashPassword(password);
    // delete req.body.password;
    // const newUser = new User(
    //   {
    //     password: hashPassword,
    //     username: mobile,
    //     ...req.body,
    //   },
    //   { timestamps: true }
    // );
    // await newUser.save();
    User.register(
      { username: mobile, ...req.body },
      password,
      function (err, user) {
        if (err) {
          logging.error("Add User", "unable to add user", err);
          if (err?.message)
            return responseObj({
              statusCode: HTTP_RESPONSE.BED_REQUEST,
              type: "error",
              msg: err?.message,
              error: null,
              resObj: res,
              data: null,
            });
          return responseObj({
            statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
            type: "error",
            msg: err?.message || "unable to process your request",
            error: null,
            resObj: res,
            data: null,
          });
        }
        const {
          name,
          username,
          mobile,
          staffRole,
          department,
          aadhar,
          address,
          isActive,
          _id,
          updateAt,
          createdAt,
          permissions
        } = user;
        const roleObj: any = roles.find((r) => r.name === staffRole);

        return responseObj({
          statusCode: HTTP_RESPONSE.SUCCESS,
          type: "success",
          msg: "User added successfully ",
          error: null,
          resObj: res,
          data: {
            name,
            username,
            mobile,
            staffRole,
            isActive,
            department,
            aadhar,
            address,
            // permission: roleObj?.permissions,
            permissions,
            _id,
            updateAt,
            createdAt,
          },
        });
      }
    );
  } catch (error: any) {
    logging.error("Add User", "unable to add user-----", error?.message);
    if (error?.message)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message || "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const login = (req: Request, res: Response) => {
  // Create a token
  const token = getToken({ _id: req.user?._id });
  // Response
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  const {
    name,
    username,
    mobile,
    staffRole,
    department,
    isActive,
    _id,
    updateAt,
    createdAt,
    permissions,
  }: any = req.user;
  // const roleObj: any = roles.find((r) => r.name === staffRole);

  if (!isActive)
    return responseObj({
      statusCode: HTTP_RESPONSE.UNAUTHORIZED,
      type: "success",
      msg: "You are  UNAUTHORIZED!",
      error: null,
      resObj: res,
      data: null,
    });

  return responseObj({
    statusCode: HTTP_RESPONSE.SUCCESS,
    type: "success",
    msg: "You are successfully logged in!",
    error: null,
    resObj: res,
    data: {
      user: {
        name,
        username,
        mobile,
        staffRole,
        department,
        isActive,
        _id,
        updateAt,
        createdAt,
        permissions,
        // permission: roleObj?.permissions,
      },
      token,
    },
  });
};

export const profile = (req: Request, res: Response) => {
  // Response
  // console.log("user ", req.user);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  const {
    name,
    username,
    mobile,
    staffRole,
    department,
    isActive,
    _id,
    updateAt,
    createdAt,
    permissions,
  }: any = req.user;
  // const roleObj: any = roles.find((r) => r.name === staffRole);

  return responseObj({
    statusCode: HTTP_RESPONSE.SUCCESS,
    type: "success",
    msg: "You are successfully logged in!",
    error: null,
    resObj: res,
    data: {
      user: {
        name,
        username,
        mobile,
        department,
        staffRole,
        isActive,
        _id,
        updateAt,
        createdAt,
        permissions,
        // permission: roleObj?.permissions,
      },
    },
  });
};

export const assignUserAreaAndStatus = async (req: Request, res: Response) => {
  try {
    const { department = "", isActive = false, _id = "" }: IUser = req.body;

    if (_id === "" || department == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Plear provide valid user id and department where user will work",
        error: null,
        resObj: res,
        data: null,
      });
    }

    // const authorized_user_role = req.user?.staffRole;
    // if (!hasPermission(authorized_user_role, "UPDATE", CAPTAIN)) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.UNAUTHORIZED,
    //     type: "error",
    //     msg: "Have no permission to create user with this role",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }

    await User.updateOne(
      {
        _id,
      },
      {
        department,
        isActive,
      }
    );

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "User update successfully ",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Update Area User", "unable to update user", error);
    if (error?.message)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message || "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const {
      name = "",
      mobile = "",
      password = "",
      staffRole = "",
    }: IUser = req.body;

    if (name == "" || mobile == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Name, mobile,staff role and password are required",
        error: null,
        resObj: res,
        data: null,
      });
    }

    // const authorized_user_role = req.user?.staffRole;
    // if (!hasPermission(authorized_user_role, "CREATE", staffRole)) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.UNAUTHORIZED,
    //     type: "error",
    //     msg: "Have no permission to create user with this role",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    // delete req.body.password;
    console.log("req ", req.body);
    await User.updateOne(
      {
        _id: req.body._id,
      },
      {
        ...req.body,
      }
    );

    //   User.findOne({ _id: req.body._id }, function (err, user) {
    //     if (!err) {
    //         user.changePassword(req.body.oldPassword, req.body.newPassword, function (err) {
    //             if (!err) {
    //                 console.log(password)
    //             } else {
    //                 console.log(err);
    //             }
    //         })
    //     } else {
    //         console.log(err);
    //     }
    //  })
    if (req.body.password && req.body.password !== "") {
      let userToReset = await User.findOne({ _id: req.body._id });
      userToReset.setPassword(req.body.password, async (err) => {
        if (err) {
          console.log("unable to reset password");
        }
        await userToReset.save();
      });
    }
    console.log("req update ", req.body);
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "User updated successfully ",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Update User", "unable to update user", error);
    if (error?.message?.includes("E11000 duplicate key")) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "May be you try that number already exists!",
        error: null,
        resObj: res,
        data: null,
      });
    }
    if (error?.message)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message || "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id, staffRole } = req.params;

    if (id == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Please provide valid user id",
        error: null,
        resObj: res,
        data: null,
      });
    }

    // const authorized_user_role = req.user?.staffRole;
    // if (!hasPermission(authorized_user_role, "DELETE", staffRole)) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.UNAUTHORIZED,
    //     type: "error",
    //     msg: "Have no permission to delete user with this role",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }

    await User.deleteOne({ _id: id });

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "User deleted successfully ",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Delete User", "unable to delete user", error);
    if (error?.message)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message || "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { staffRole = "" } = req.params;
    // const authorized_user_role = req.user?.staffRole;
    // if (!hasPermission(authorized_user_role, "READ", staffRole)) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.UNAUTHORIZED,
    //     type: "error",
    //     msg: "Have no permission to delete user with this role",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    const { page = 0, perPage = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);

    const users =
      perPage == "all"
        ? await User.find({ staffRole }).sort("-createdAt")
        : await User.find({ staffRole })
            .sort("-createdAt")
            .skip(Number(skip))
            .limit(Number(perPage));
    const count = await User.find({ staffRole }).count();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "user list ",
      error: null,
      resObj: res,
      data: { users, total: count },
    });
  } catch (error: any) {
    logging.error("Get Users", "unable to get users", error);
    if (error?.message)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message || "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};
