import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IOrder } from "../../interfaces/IOrder";
import Order from "../../models/Order";
import { DEPARTMENT, KITCHEN, ORDER_STATUS } from "../../config/enums";

export const addOrder = async (req: Request, res: Response) => {
  try {
    const {
      mId = "",
      pids = [],
      tableId = "",
      customerName = "",
      // customerMobile="",
      department = DEPARTMENT.UNKNOWN,
      allocatedKitchen = KITCHEN.UNKNOWN,
      status = ORDER_STATUS.PLACED,
      waitingTime = "10",
      orderValue = 0,
    }: IOrder = req.body;

    if (
      mId == "" ||
      pids.length == 0 ||
      tableId == "" ||
      customerName == "" ||
      orderValue == 0 ||
      department == DEPARTMENT.UNKNOWN ||
      allocatedKitchen == KITCHEN.UNKNOWN
    ) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: " please provide manager Id, product ids, table Id, customer Name, department, order value and allocated Kitchen",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const newOrder: IOrder = new Order({
      ...req.body,
    });
    await newOrder.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully added new Order",
      error: null,
      resObj: res,
      data: newOrder,
    });
  } catch (error: any) {
    logging.error("Add Order", "unable to add Order", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")
          ? "duplicate Order"
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

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const {
      _id = "",
      status = ORDER_STATUS.ACCEPTED,
      captainId = "",
    }: IOrder = req.body;
    if (_id == "" || status == ORDER_STATUS.PLACED)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID and status",
        error: null,
        resObj: res,
        data: null,
      });

    await Order.updateOne(
      { _id },
      {
        $set: { status, captainId },
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Order",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Order", "unable to update Order", error);
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

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your orders",
      error: null,
      resObj: res,
      data: orders,
    });
  } catch (error) {
    logging.error("Get orders", "unable to get orders", error);
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

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID",
        error: null,
        resObj: res,
        data: null,
      });
    const order = await Order.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Order",
      error: null,
      resObj: res,
      data: order,
    });
  } catch (error) {
    logging.error("Get Order", "unable to get Order", error);
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

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Order.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Order is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Order", "unable to delete Order", error);
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