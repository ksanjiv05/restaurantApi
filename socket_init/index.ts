import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IOrder } from "../interfaces/IOrder";
import { ORDER_STATUS } from "../config/enums";
import Order from "../models/Order";
import Notification from "../models/Notification";

export const startListening = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("test", (data) => {
    console.log("__", data);
  });

  socket.on("order_cancel_request", async (data: IOrder) => {
    console.log("__", data);
    const { _id = "" }: IOrder = data;
    if (_id == "") {
      socket.emit("order_cancel_request_update", {
        type: "error",
        msg: " Please provide  order Id!",
        data: null,
      });
    }

    //update cancle
    await Order.updateOne(
      { _id },
      {
        $set: {
          status: ORDER_STATUS.CANCEL_REQUEST,
        },
      }
    );
    socket.emit("order_cancel_request_update", {
      type: "success",
      msg: " Cancel request updated successfully!",
      data: {
        ...data,
        status: ORDER_STATUS.CANCEL_REQUEST,
      },
    });

    const newNotification = new Notification({
      title: "Order Cancel Request",
      id: _id,
      action: "Pending",
      remark: "",
      actionPerformedBy: "n/a",
      actionPerformedId: "n/a",
      notificationType: "order",
      isActive: true,
    });
    await newNotification.save();
    global.socketObj?.emit("new_notification", {
      type: "success",
      msg: "Notification updated successfully!",
      data: newNotification,
    });

    //here we assing to the waiter when order is ready and notify to the user
  });

  socket.on("order_cancel_request_confirm", async (data: IOrder) => {
    console.log("__", data);
    const { _id = "", status = ORDER_STATUS.CANCEL_REQUEST }: IOrder = data;
    if (_id == "") {
      socket.emit("order_cancel_request_confirm", {
        type: "error",
        msg: " Please provide  order Id!",
        data: null,
      });
    }

    if (status === ORDER_STATUS.CANCEL) {
      //update cancle
      await Order.updateOne(
        { _id },
        {
          $set: {
            status: ORDER_STATUS.CANCEL,
          },
        }
      );
      socket.emit("order_cancel_request_update", {
        type: "success",
        msg: " Cancel request updated successfully!",
        data: {
          ...data,
          status: ORDER_STATUS.CANCEL,
        },
      });
    }

    if (status === ORDER_STATUS.REJECTED) {
      await Order.updateOne(
        { _id },
        {
          $set: {
            status: ORDER_STATUS.REJECTED,
          },
        }
      );
      socket.emit("order_cancel_request_update", {
        type: "success",
        msg: " Cancel request updated successfully!",
        data: {
          ...data,
          status: ORDER_STATUS.REJECTED,
        },
      });
    }

    //here we assing to the waiter when order is ready and notify to the user
  });

  socket.on("order_bill", (data) => {
    console.log("__", data);
    //here we assing to the waiter when order is ready and notify to the user
  });
};
