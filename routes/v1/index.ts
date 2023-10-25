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
  updateOrderItems,
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
import {
  addKitchen,
  deleteKitchen,
  getKitchen,
  getKitchens,
  updateKitchen,
} from "../../controllers/kitchenController/kitchen";
const router = express.Router();

//user
router.post("/user", verifyUser, addUser);
router.get("/user", verifyUser, getUsers);
router.get("/user/profile", verifyUser, profile);
router.get("/user/:staffRole", verifyUser, getUsers);

router.delete("/user/:id/:staffRole", verifyUser, deleteUser);
router.put("/user/captain", verifyUser, assignUserAreaAndStatus);
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
router.get("/table", getTables);
router.get("/table/:id", verifyUser, getTable);
router.delete("/table/:id", verifyUser, deleteTable);

// //order
router.post("/order/waiting", verifyUser, addWaitingOrder);
router.put("/order/waiting", verifyUser, updateWaitingOrder);
router.get("/order/waiting", verifyUser, getWaitingOrders);
router.get("/order/waiting/:id", verifyUser, getWaitingOrder);
router.delete("/order/waiting/:id", verifyUser, deleteWaitingOrder);

// //order
router.post("/order", verifyUser, addOrder);
router.put("/order", verifyUser, updateOrder);
router.put("/order/food", verifyUser, updateOrderItems);

router.get("/order", getOrders);
router.get("/order/:id", verifyUser, getOrder);

router.post("/kitchen", addKitchen);
router.put("/kitchen", verifyUser, updateKitchen);
router.get("/kitchen", verifyUser, getKitchens);
router.get("/kitchen/:id", verifyUser, getKitchen);
router.delete("/kitchen/:id", verifyUser, deleteKitchen);

router.get("/static/upload", upload.single("food"), addStaticImage);

// //order
router.post("/food", verifyUser, upload.single("image"), addFoodProduct);
router.post("/food/bulk", verifyUser, upload.single("food"), addBulkFood);

router.post(
  "/food/update",
  verifyUser,
  upload.single("image"),
  updateFoodProduct
);
router.get("/food", verifyUser, getFoodProducts);
router.get("/food/:id", verifyUser, getFoodProduct);
router.delete("/food/:id", verifyUser, deleteFoodProduct);

export default router;
