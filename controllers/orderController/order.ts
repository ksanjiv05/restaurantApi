import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IOrder, TableProps } from "../../interfaces/IOrder";
import Order from "../../models/Order";
import { DEPARTMENT, KITCHEN, ORDER_STATUS } from "../../config/enums";
import Table from "../../models/Table";
import mongoose from "mongoose";
import { tableUpdateAfterBill } from "../tableController/table";

export const addOrder = async (req: Request, res: Response) => {
  try {
    // const {
    //   tableIds = [],
    //   captainId = "",
    //   captainName = "",
    // }: IOrder = req.body;

    // if (tableIds.length == 0) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: " please provide  table Id!",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }

    // if (captainId == "") {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: " Please provide  captain Id!",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    // if (captainName == "") {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: " Please provide  captain Name!",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    req.body.status = ORDER_STATUS.PLACED;
    const newOrder: IOrder = new Order({
      ...req.body,
    });
    let error: any = newOrder.validateSync();
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
    // const tables = await Table.find(
    //   {
    //     _id: {
    //       $in: req.body.tableIds.map(
    //         (id: string) => new mongoose.Types.ObjectId(id)
    //       ),
    //     },
    //   },
    // );

    await Table.updateMany(
      {
        _id: {
          $in: req.body.tableIds.map(
            (tableObj: TableProps) =>
              new mongoose.Types.ObjectId(tableObj.tableId)
          ),
        },
      },
      {
        $inc: { occupiedSeat: 1 },
      }
    );
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
    const { _id = "", status = ORDER_STATUS.ACCEPTED }: IOrder = req.body;
    if (_id == "")
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
        ...req.body,
      }
    );

    if (status === ORDER_STATUS.COMPLETED) {
      updateOrderAfterBill(req.body);
    }
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

export const updateOrderItems = async (req: Request, res: Response) => {
  try {
    const { _id = "", pids = [] }: IOrder = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID ",
        error: null,
        resObj: res,
        data: null,
      });

    // const order = await Order.findOne({ _id });
    if (!order)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID ",
        error: null,
        resObj: res,
        data: null,
      });
    // order.pids =pids// [...order.pids, ...pids];
    // await order.save();
    // await Order.updateOne({_id},)
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
    const {
      page = 0,
      perPage = 10,
      department = DEPARTMENT.UNKNOWN,
      allocatedKitchen = KITCHEN.UNKNOWN,
      status = ORDER_STATUS.UNKNOWN,
      mid = "",
      tableId = "",
    } = req.query;
    // page //perPage
    const skip = (Number(page) - 1) * Number(perPage);

    const filter = {
      ...(department === DEPARTMENT.UNKNOWN ? {} : { department }),
      ...(allocatedKitchen === KITCHEN.UNKNOWN ? {} : { allocatedKitchen }),
      ...(mid === "" ? {} : { mId: mid }),
      ...(status === ORDER_STATUS.UNKNOWN
        ? { status: { $ne: ORDER_STATUS.WAITING } }
        : { status }),
      ...(tableId === "" ? {} : { tableIds: { $elemMatch: { tableId } } }),
    };

    const orders = await Order.find(filter)
      .skip(Number(skip))
      .limit(Number(perPage));
    const total = await Order.find(filter).count();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your orders",
      error: null,
      resObj: res,
      data: { orders, total },
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

export const updateOrderAfterBill = async (order: IOrder) => {
  const { tableIds = [] } = order;
  const table = String(tableIds[0].tableNumber);
  const regx = new RegExp(table, "i");
  const department = order.department;
  console.log("regx", regx);
  const orders = await Order.find({
    department,
    tableIds: { $elemMatch: { tableNumber: regx } },
    status: { $ne: ORDER_STATUS.COMPLETED },
  });

  console.log("orders", JSON.stringify(orders));
  if (orders.length == 0) {
    const tableId = tableIds[0].tableId;
    tableUpdateAfterBill(tableId);
    global.socketObj?.emit("table_update", {
      type: "success",
      msg: "Table updated successfully!",
      data: {
        tableId,
        tableNumber: table,
      },
    });
  }
};

// {
//   "tableId": "6540849aa0e79637407e53ea",
//   "tableNumber": "1E",
//   "_id": "6548fb1dab2f0e0acd2ae3ad"
// }
