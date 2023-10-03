import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const startListening = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  socket.on("test", (data) => {
    console.log("__", data);
  });

  socket.on("order_updated", (data) => {
    console.log("__", data);
    //here we assing to the waiter when order is ready and notify to the user
  });
};
