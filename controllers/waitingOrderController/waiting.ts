import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IOrder } from "../../interfaces/IOrder";
import Order from "../../models/Order";
import { DEPARTMENT, KITCHEN, ORDER_STATUS } from "../../config/enums";

export const addWaitingOrder = async (req: Request, res: Response) => {
  try {
    req.body.status = ORDER_STATUS.WAITING;
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    req.body.WaitingToken = (lastOrder && lastOrder?.WaitingToken + 1) || 1;
    const newWaiting: IOrder = new Order({
      ...req.body,
    });
    let error: any = newWaiting.validateSync();
    let errors = {};

    if (error) {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

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
      status = ORDER_STATUS.ACCEPTED,
      tableIds = [],
    }: IOrder = req.body;
    if (_id == "" || tableIds.length == 0)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID and tableId ",
        error: null,
        resObj: res,
        data: null,
      });

    await Order.updateOne(
      { _id },
      {
        $set: { tableIds, status: ORDER_STATUS.ACCEPTED },
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
    const {
      page = 0,
      perPage = 10,
      department = DEPARTMENT.UNKNOWN,
    } = req.query;
    // page //perPage

    const _id = req.user?._id.toString() || "";
    console.log("req.user", page,perPage);

    const skip = (Number(page) - 1) * Number(perPage);
    const filter = {
      ...(department === DEPARTMENT.UNKNOWN ? {} : { department }),
      ...(_id === "" ? {} : { mId: _id }),
    };
    const waitings = await Order.find(filter)
      .sort("-createdAt")
      .skip(Number(skip))
      .limit(Number(perPage));
    const total = await Order.find(filter).count();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Waiting Orders",
      error: null,
      resObj: res,
      data: { waiting_orders: waitings, total },
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
    const waiting = await Order.findOne({ _id: id });
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
    await Order.deleteOne({ _id: id });
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
