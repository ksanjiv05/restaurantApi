import { Request, Response } from "express";
import logging from "../../config/logging";
import { responseObj } from "../../helper/response";
import { HTTP_RESPONSE } from "../../helper/constants";

export const addStaticImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully uploaded the file",
      error: null,
      resObj: res,
      data: { filename: file?.filename },
    });
  } catch (error: any) {
    logging.error("Add Static File", "unable to add static file", error);

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
