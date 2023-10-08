import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IWaiting } from "../../interfaces/IWaiting";
import Waiting from "../../models/Waiting";
import { DEPARTMENT, KITCHEN, Waiting_STATUS } from "../../config/enums";

export const addWaitingOrder = async (req: Request, res: Response) => {
  try {
    // const {
    //   mId = "",
    //   pids = [],
    //   tableIds = [],
    //   customerName = "",
    //   // customerMobile="",
    //   department = DEPARTMENT.UNKNOWN,
    //   allocatedKitchen = KITCHEN.UNKNOWN,
    //   status = Waiting_STATUS.PLACED,
    //   waitingTime = "10",
    //   WaitingValue = 0,
    // }: IWaiting = req.body;

    // if (
    //   mId == "" ||
    //   pids.length == 0 ||
    //   tableIds.length == 0 ||
    //   customerName == "" ||
    //   WaitingValue == 0 ||
    //   department == DEPARTMENT.UNKNOWN ||
    //   allocatedKitchen == KITCHEN.UNKNOWN
    // ) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: " please provide manager Id, product ids, table Id, customer Name, department, Waiting value and allocated Kitchen",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }

    const newWaiting: IWaiting = new Waiting({
      ...req.body,
    });
    let error: any = newWaiting.validateSync();
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
    if (error) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "errors",
        error: errors,
        resObj: res,
        data: null,
      });
    }
    await newWaiting.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully added new Waiting Order",
      error: null,
      resObj: res,
      data: newWaiting,
    });
  } catch (error: any) {
    logging.error("Add Waiting Order", "unable to add Waiting Order", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")
          ? "duplicate Waiting Order"
          : error.message,
        error: null,
        resObj: res,
        data: null,
      });
    }

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

export const updateWaitingOrder = async (req: Request, res: Response) => {
  try {
    const {
      _id = "",
      status = Waiting_STATUS.ACCEPTED,
      WaitingToken = 0,
    }: IWaiting = req.body;
    if (_id == "" || status == Waiting_STATUS.PLACED)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Waiting ID and status",
        error: null,
        resObj: res,
        data: null,
      });

    await Waiting.updateOne(
      { _id },
      {
        $set: { WaitingToken },
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Waiting Order",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error(
      "Update Waiting Order",
      "unable to update Waiting Order",
      error
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const getWaitingOrders = async (req: Request, res: Response) => {
  try {
    const { page = 0, perPage = 10 } = req.query;
    // page //perPage
    const skip = (Number(page) - 1) * Number(perPage);

    const waitings = await Waiting.find()
      .sort("-createdAt")
      .skip(Number(skip))
      .limit(Number(perPage));
    const total = await Waiting.find().count();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Waiting Orders",
      error: null,
      resObj: res,
      data: { waitings, total },
    });
  } catch (error) {
    logging.error("Get Waiting Order", "unable to get Waitings", error);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const getWaitingOrder = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Waiting ID",
        error: null,
        resObj: res,
        data: null,
      });
    const waiting = await Waiting.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Waiting",
      error: null,
      resObj: res,
      data: waiting,
    });
  } catch (error) {
    logging.error("Get Waiting Order", "unable to get Waiting", error);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const deleteWaitingOrder = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Waiting ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Waiting.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Waiting Order is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Waiting Order", "unable to delete Waiting", error);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};
