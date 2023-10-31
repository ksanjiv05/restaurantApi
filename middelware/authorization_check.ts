import { Request, Response } from "express";
import { IUser } from "../interfaces/IUser";
import {
  CREATE,
  DELETE,
  DIRECTOR,
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

const getPermission = (uri: string,userRole:string) => {
  uri = uri.toLowerCase().split("/")[3];
  switch (uri) {
    case "user":
      return userRole;
    case "inventory":
      return INVENTORY;
    case "order":
      return ORDER;
    case "kitchen":
      return KITCHEN;
    case "table":
      return TABLE;
    case "food":
      return FOOD;
    default:
      return undefined;
  }
};

// const getPermissionHerarchy=(role:string)=>{
//   switch(role){
//     case DIRECTOR:
//       return 
//   }
// }


export const authorizationCheck = (
  req: Request,
  res: Response,
  next: Function
) => {
  const { user = null }: any = req;
  const { method, originalUrl } = req;
  console.log("user", method, originalUrl, originalUrl.split("/")[3]);
  if (!user) {
    return res.status(401).json({
      message: "You are not authorized",
    });
  }

  const { permissions = [],staffRole="UNKNOWN" } = user;
  if (permissions.length === 0) {
    return res.status(401).json({
      message: "You are not authorized to perform this action",
    });
  }
  // const { method, originalUrl } = req;
  const action = getAction(method);
  // const { staffRole } = req.body;
  const permission = permissions.find(
    (pObj: any) => pObj.permissionType === action
  );
  console.log("usr",user)

  if (!permission) {
    return res.status(401).json({
      message: "You are not authorized to perform this action",
    });
  } else {
    const permissionName = getPermission(originalUrl,staffRole);
    const isPermission = permission.permissionArray.includes(permissionName);
    console.log("permiss ion",permissionName,isPermission)
    if (isPermission) {
      next();
    } else {
      return res.status(401).json({
        message: "You are not authorized to perform this action",
      });
    }
  }
};
