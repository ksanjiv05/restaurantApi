import { Request, Response } from "express";
import logging from "../../config/logging";
import User from "../../models/User";
import { IUser } from "../../interfaces/IUser";
import { responseObj } from "../../helper/response";
import { HTTP_RESPONSE } from "../../helper/constants";
import { getHashPassword, getToken } from "../../helper/auth";
import { hasPermission } from "../../helper/check_permission";
import { MANAGER } from "../../config/config";
import roles from "../../config/roles";

export const addUser = async (req: Request, res: Response) => {
  try {
    const {
      name = "",
      mobile = "",
      password = "",
      staffRole = "",
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

    console.log("req.user", req.user);
    const authorized_user_role = req.user?.staffRole;
    if (!hasPermission(authorized_user_role, "CREATE", staffRole)) {
      return responseObj({
        statusCode: HTTP_RESPONSE.UNAUTHORIZED,
        type: "error",
        msg: "Have no permission to create user with this role",
        error: null,
        resObj: res,
        data: null,
      });
    }
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
          isActive,
          _id,
          updateAt,
          createdAt,
        } = user;
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
            _id,
            updateAt,
            createdAt,
          },
        });
      }
    );
  } catch (error: any) {
    logging.error("Add User", "unable to add user", error);
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
  const token = getToken({ _id: req.user._id });
  // Response
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  const {
    name,
    username,
    mobile,
    staffRole,
    isActive,
    _id,
    updateAt,
    createdAt,
  }: IUser = req.user;
  const roleObj: any = roles.find((r) => r.name === staffRole);

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
        isActive,
        _id,
        updateAt,
        createdAt,
        permission: roleObj?.permissions,
      },
      token,
    },
  });
  // res.json({
  //   success: true,
  //   token: token,

  //   status: "You are successfully logged in!",
  // });
};

export const profile = (req: Request, res: Response) => {
  // Response
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  const {
    name,
    username,
    mobile,
    staffRole,
    isActive,
    _id,
    updateAt,
    createdAt,
  }: IUser = req.user;
  const roleObj: any = roles.find((r) => r.name === staffRole);

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
        isActive,
        _id,
        updateAt,
        createdAt,
        permission: roleObj?.permissions,
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

    const authorized_user_role = req.user?.staffRole;
    if (!hasPermission(authorized_user_role, "UPDATE", MANAGER)) {
      return responseObj({
        statusCode: HTTP_RESPONSE.UNAUTHORIZED,
        type: "error",
        msg: "Have no permission to create user with this role",
        error: null,
        resObj: res,
        data: null,
      });
    }

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

    const hashPassword = await getHashPassword(password);
    delete req.body.password;
    const newUser = new User(
      {
        password: hashPassword,
        ...req.body,
      },
      { timestamps: true }
    );
    await newUser.save();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "User added successfully ",
      error: null,
      resObj: res,
      data: newUser,
    });
  } catch (error: any) {
    logging.error("Add User", "unable to add user", error);
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
    const { _id, staffRole }: IUser = req.body;

    if (_id == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Plear provide valid user _id",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const authorized_user_role = req.user?.staffRole;
    if (!hasPermission(authorized_user_role, "DELETE", staffRole)) {
      return responseObj({
        statusCode: HTTP_RESPONSE.UNAUTHORIZED,
        type: "error",
        msg: "Have no permission to delete user with this role",
        error: null,
        resObj: res,
        data: null,
      });
    }

    await User.deleteOne({ _id });

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
    const authorized_user_role = req.user?.staffRole;
    if (!hasPermission(authorized_user_role, "READ", staffRole)) {
      return responseObj({
        statusCode: HTTP_RESPONSE.UNAUTHORIZED,
        type: "error",
        msg: "Have no permission to delete user with this role",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const users = await User.find();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "user list ",
      error: null,
      resObj: res,
      data: users,
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
