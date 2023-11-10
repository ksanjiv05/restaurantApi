import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { BASE_URL } from "../../config/config";

export const printOrder = (req: Request, res: Response) => {
  try {
    // const file = req.file;
    // if (!file) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: "file not found",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    const { order = "" } = req.body;
    console.log("order", order);
    global.socketObj?.emit(
      "order_print",
      //   BASE_URL + "/static/" + file?.filename,
      { order },
      (status: string) => {
        console.log("order print status ", status);
        if (status === "done")
          return responseObj({
            statusCode: HTTP_RESPONSE.SUCCESS,
            type: "error",
            msg: "print triggered",
            error: null,
            resObj: res,
            data: null,
          });
        else {
          return responseObj({
            statusCode: HTTP_RESPONSE.SUCCESS,
            type: "error",
            msg: "print triggered",
            error: null,
            resObj: res,
            data: null,
          });
        }
      }
    );
  } catch (error: any) {
    logging.error("Order Print", "unable to add Inventory", error);

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

export const printKot = (req: Request, res: Response) => {
  try {
    // const file = req.file;
    const { kot = "" } = req.body;
    // console.log("kot", kot);
    // if (!file) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: "file not found",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }

    global.socketObj?.emit("kot_print", { kot }, (status: string) => {
      console.log("order print status ", status);
      if (status === "done")
        return responseObj({
          statusCode: HTTP_RESPONSE.SUCCESS,
          type: "error",
          msg: "print triggered",
          error: null,
          resObj: res,
          data: null,
        });
      else {
        return responseObj({
          statusCode: HTTP_RESPONSE.SUCCESS,
          type: "error",
          msg: "print triggered",
          error: null,
          resObj: res,
          data: null,
        });
      }
    });
  } catch (error: any) {
    logging.error("Kot Print", "unable to add Inventory", error);

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
