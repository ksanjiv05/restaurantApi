import { Response } from "express";

interface IResponseObj {
  resObj: Response;
  statusCode: number;
  type: string | "error";
  msg: string | "";
  error: string |null;
  data: string | object | null;
}

export const responseObj = ({
  resObj,
  type,
  statusCode,
  msg,
  error,
  data,
}: IResponseObj) => {
  return resObj.status(statusCode).json({
    type,
    msg,
    error,
    data,
  });
};
