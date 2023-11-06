import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IOrder } from "../interfaces/IOrder";
import { ORDER_STATUS } from "../config/enums";
import Order from "../models/Order";

export const startListening = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("test", (data) => {
    console.log("__", data);
  });

  socket.on("order_cancel_request", async (data: IOrder) => {
    console.log("__", data);
    const { _id = "", status = ORDER_STATUS.PLACED }: IOrder = data;
    if (_id == "") {
      socket.emit("order_cancel", {
        type: "error",
        msg: " Please provide  order Id!",
      });
    }

    if (status === ORDER_STATUS.CANCEL_REQUEST) {
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
      });

      socket.emit("order_cancel_request", {
        type: "success",
        msg: " Cancel request sent successfully!",
      });
    }

    //here we assing to the waiter when order is ready and notify to the user
  });

  socket.on("order_cancel_request_confirm", async (data: IOrder) => {
    console.log("__", data);
    const { _id = "", status = ORDER_STATUS.CANCEL_REQUEST }: IOrder = data;
    if (_id == "") {
      socket.emit("order_cancel", {
        type: "error",
        msg: " Please provide  order Id!",
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
      });
    }

    //here we assing to the waiter when order is ready and notify to the user
  });

  socket.on("order_bill", (data) => {
    console.log("__", data);
    //here we assing to the waiter when order is ready and notify to the user
  });
};
