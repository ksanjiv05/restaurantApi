import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { INotification } from "../../interfaces/INotification";
import Notification from "../../models/Notification";
import { DEPARTMENT } from "../../config/enums";

export const addNotification = async (req: Request, res: Response) => {
  try {
    const {}: //   isSifted = false,
    INotification = req.body;

    const newNotification = new Notification(req.body);
    let error: any = newNotification.validateSync();
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
    await newNotification.save();

    global.socketObj?.emit("new_notification", {
      type: "success",
      msg: "Notification updated successfully!",
      data: newNotification,
    });

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Notification",
      error: null,
      resObj: res,
      data: newNotification,
    });
  } catch (error: any) {
    logging.error("Add Notification", "unable to add Notification", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")
          ? "duplicate Notification "
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

// export const updateNotificationSingle = async (req: Request, res: Response) => {
//   try {
//     const { _id = "" } = req.body;
//     if (_id == "" )
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide a valid Notification ID",
//         error: null,
//         resObj: res,
//         data: null,
//       });

//     await Notification.updateOne(
//       { _id },
//       {
//         ...req.body,
//       }
//     );
//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "hey, you are successfully updated Notification",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   } catch (error) {
//     logging.error("Update Notification", "unaable to update Notification", error);
//     return responseObj({
//       statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
//       type: "error",
//       msg: "unable to process your request",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   }
// };

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Notification ID",
        error: null,
        resObj: res,
        data: null,
      });

    await Notification.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    global.socketObj?.emit("new_notification", {
      type: "success",
      msg: "Notification updated successfully!",
      data: {
        ...req.body,
      },
    });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Notification",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error(
      "Update Notification",
      "unaable to update Notification",
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

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { page = 0, perPage = 10 } = req.query;
    // page //perPage
    const skip = (Number(page) - 1) * Number(perPage);

    const filter = {};
    let count = 0;
    let notifications = await Notification.find({})
      .skip(Number(skip))
      .limit(Number(perPage));
    count = await Notification.find({}).count();
    // console.log("Notifications ", Notifications);
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Notifications",
      error: null,
      resObj: res,
      data: {
        notifications: notifications,
        total: count,
      },
    });
  } catch (error) {
    logging.error("Get Notifications", "unable to get Notifications", error);
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

export const getNotification = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Notification ID",
        error: null,
        resObj: res,
        data: null,
      });
    const notification = await Notification.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Notification",
      error: null,
      resObj: res,
      data: notification,
    });
  } catch (error) {
    logging.error("Get Notification", "unable to get Notification", error);
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

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Notification ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Notification.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Notification is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error(
      "Delete Notification",
      "unable to delete Notification",
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
