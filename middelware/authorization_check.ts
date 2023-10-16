import { Request, Response } from "express";
import { IUser } from "../interfaces/IUser";

export const authorizationCheck = (
  req: Request,
  res: Response,
  next: Function
) => {
  const { user }: IUser = req;
  const { staffRole } = req.body;
  const { permissions = [] } = user;
  if (permissions.length === 0) {
    return res.status(401).json({
      message: "You are not authorized to perform this action",
    });
  }
};
