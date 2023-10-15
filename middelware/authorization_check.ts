import { Request, Response } from "express";

export const authorizationCheck = (
  req: Request,
  res: Response,
  next: Function
) => {
  const { user } = req;
  const { permissions = [] } = user;
  if (permissions.length === 0) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }
};
