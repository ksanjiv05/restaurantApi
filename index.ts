import dotenv from "dotenv";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import "./db";
import router from "./routes/v1";

import http from "http";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser"; // parser middleware
import session from "express-session"; // session middleware
import passport from "passport"; // authentication
import LocalStrategy from "passport-local";
// import connectEnsureLogin from 'connect-ensure-login'
import logging from "./config/logging";
import { startListening } from "./socket_init";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { hasPermission } from "./helper/check_permission";
import { createRootUser } from "./scripts";
import { csvParser, csvToJson } from "./helper/utils";
import FoodProduct from "./models/FoodProduct";
import {
  CREATE,
  OPERATIONAL_MANAGER,
  FB_MANAGER,
  CASHIER,
  ADMIN,
  MANAGER,
  CAPTAIN,
  ORDER,
  INVENTORY,
  REPORTS,
  UPDATE,
  READ,
  DELETE,
} from "./config/config";

dotenv.config();

globalThis.__dirname = __dirname;
const app: Express = express();
const port = 4000;
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);
app.use(passport.initialize());
app.use(passport.session());

//socket io configuration
const server = http.createServer(app);
const io = new Server(server);

declare global {
  var socketObj: Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  > | null;
}

// global.socketObj:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>|null = null;
//socket io connection test
io.on("connection", (socket) => {
  logging.info("SOCKET", "connection established");
  global.socketObj = socket;
  socket.on("disconnect", () => {
    logging.error("SOCKET", "user disconnected");
  });
  startListening(socket);
});
// socket io configuration end
app.use("/static", express.static("uploads"));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

// console.log("permission ", hasPermission("FB_MANAGER", "READ", "INVENTORY"));

// createRootUser({
//   name: "Root User",
//   mobile: "8799999982",
//   username: "8799999982",
//   staffRole: "DIRECTOR",
//   password: "Test@1234",
//   isActive: true,
//   permissions: [
//     {
//       permissionType: CREATE,
//       permissionArray: [
//         OPERATIONAL_MANAGER,
//         FB_MANAGER,
//         CASHIER,
//         ADMIN,
//         MANAGER,
//         CAPTAIN,
//         ORDER,
//         INVENTORY,
//         REPORTS,
//       ],
//     },
//     {
//       permissionType: UPDATE,
//       permissionArray: [
//         OPERATIONAL_MANAGER,
//         FB_MANAGER,
//         CASHIER,
//         ADMIN,
//         MANAGER,
//         CAPTAIN,
//         ORDER,
//         INVENTORY,
//         REPORTS,
//       ],
//     },
//     {
//       permissionType: READ,
//       permissionArray: [
//         OPERATIONAL_MANAGER,
//         FB_MANAGER,
//         CASHIER,
//         ADMIN,
//         MANAGER,
//         CAPTAIN,
//         ORDER,
//         INVENTORY,
//         REPORTS,
//       ],
//     },
//     {
//       permissionType: DELETE,
//       permissionArray: [
//         OPERATIONAL_MANAGER,
//         FB_MANAGER,
//         CASHIER,
//         ADMIN,
//         MANAGER,
//         CAPTAIN,
//         ORDER,
//         INVENTORY,
//         REPORTS,
//       ],
//     },
//   ],
// });

// const runTest = async () => {
//   const data = await csvToJson("food.csv");
//   console.log("data ", data);
//   FoodProduct.insertMany(data, { ordered: false });
// };
// runTest();
export default app;
