import { Request, Response } from "express";
import { IUser } from "../interfaces/IUser";
import {
  CREATE,
  DELETE,
  FOOD,
  INVENTORY,
  KITCHEN,
  ORDER,
  READ,
  TABLE,
  UPDATE,
  USER_MANAGEMENT,
} from "../config/config";

const getAction = (method: string) => {
  method = method.toLowerCase();
  switch (method) {
    case "post":
      return CREATE;
    case "get":
      return READ;
    case "put":
      return UPDATE;
    case "delete":
      return DELETE;
    default:
      return undefined;
  }
};

const getPermission = (uri: string) => {
  uri = uri.toLowerCase();
  switch (uri) {
    case "/api/user":
      return USER_MANAGEMENT;
    case "/api/inventory":
      return INVENTORY;
    case "/api/order":
      return ORDER;
    case "/api/kitchen":
      return KITCHEN;
    case "/api/table":
      return TABLE;
    case "/api/food":
      return FOOD;
    default:
      return undefined;
  }
};

export const authorizationCheck = (
  req: Request,
  res: Response,
  next: Function
) => {
  const { user = null }: any = req;
  if (!user) {
    return res.status(401).json({
      message: "You are not authorized",
    });
  }

  const { permissions = [] } = user;
  if (permissions.length === 0) {
    return res.status(401).json({
      message: "You are not authorized to perform this action",
    });
  }
  const { method, originalUrl } = req;
  const action = getAction(method);
  const { staffRole } = req.body;
  const permission = permissions.find(
    (pObj: any) => pObj.permissionType === action
  );
  if (!permission) {
    return res.status(401).json({
      message: "You are not authorized to perform this action",
    });
  } else {
    const permissionName = getPermission(originalUrl);
    const isPermission = permission.permissionArray.includes(permissionName);
    if (isPermission) {
      next();
    } else {
      return res.status(401).json({
        message: "You are not authorized to perform this action",
      });
    }
  }
};
