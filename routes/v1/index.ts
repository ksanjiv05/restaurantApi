import express from "express";
import {
  addUser,
  assignUserAreaAndStatus,
  deleteUser,
  getUsers,
  login,
  profile,
  updateUser,
} from "../../controllers/authController/auth";

import { upload } from "../../middelware/uploder";
import passport from "passport";
import { verifyUser } from "../../middelware/auth";

import {
  addTable,
  deleteTable,
  getTable,
  getTables,
  updateTable,
} from "../../controllers/tableController/table";
import {
  addBulkInventory,
  addInventory,
  deleteInventory,
  getInventories,
  getInventory,
  updateInventory,
} from "../../controllers/inventoryController/inventory";
import {
  addOrder,
  updateOrder,
  getOrders,
  getOrder,
} from "../../controllers/orderController/order";
import { addStaticImage } from "../../controllers/staticController/static";
import {
  addBulkFood,
  addFoodProduct,
  deleteFoodProduct,
  getFoodProduct,
  getFoodProducts,
  updateFoodProduct,
} from "../../controllers/foodController/food";
import {
  addWaitingOrder,
  deleteWaitingOrder,
  getWaitingOrder,
  getWaitingOrders,
  updateWaitingOrder,
} from "../../controllers/waitingOrderController/waiting";
const router = express.Router();

//user
router.post("/user", verifyUser, addUser);
router.get("/user", verifyUser, getUsers);
router.get("/user/profile", verifyUser, profile);
router.get("/user/:staffRole", verifyUser, getUsers);

router.delete("/user/:id/:staffRole", verifyUser, deleteUser);
router.put("/user/manager", verifyUser, assignUserAreaAndStatus);
router.put("/user", verifyUser, updateUser);
router.post("/login", passport.authenticate("local"), login);

//get user profile

//inventory
// router.post("/inventory/bulk", upload.single("inventory"), addBulkInventory);
router.post("/inventory", verifyUser, addInventory);
router.put("/inventory", verifyUser, updateInventory);
router.get("/inventory", verifyUser, getInventories);
router.get("/inventory/:id", verifyUser, getInventory);
router.delete("/inventory/:id", verifyUser, deleteInventory);

//table
router.post("/table", verifyUser, addTable);
router.put("/table", verifyUser, updateTable);
router.get("/table", verifyUser, getTables);
router.get("/table/:id", verifyUser, getTable);
router.delete("/table/:id", verifyUser, deleteTable);
// //order
router.post("/order", addOrder);
router.put("/order", verifyUser, updateOrder);
router.get("/order", verifyUser, getOrders);
router.get("/order/:id", verifyUser, getOrder);

router.get("/static/upload", upload.single("food"), addStaticImage);

// //order
router.post("/food", verifyUser, upload.single("image"), addFoodProduct);
router.post("/food/bulk", verifyUser, upload.single("food"), addBulkFood);

router.put("/food", verifyUser, updateFoodProduct);
router.get("/food", verifyUser, getFoodProducts);
router.get("/food/:id", verifyUser, getFoodProduct);
router.delete("/food/:id", verifyUser, deleteFoodProduct);

// //order
router.post("/order/waiting", verifyUser, addWaitingOrder);
router.put("/order/waiting", verifyUser, updateWaitingOrder);
router.get("/order/waiting", verifyUser, getWaitingOrders);
router.get("/order/waiting/:id", verifyUser, getWaitingOrder);
router.delete("/order/waiting/:id", verifyUser, deleteWaitingOrder);

export default router;
