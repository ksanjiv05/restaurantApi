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
import { authorizationCheck } from "../../middelware/authorization_check";
const router = express.Router();

//user
router.post("/user", verifyUser, authorizationCheck, addUser);
// router.get("/user", verifyUser, getUsers);
router.get("/user/profile", verifyUser, profile);
router.get("/user/:staffRole", verifyUser, authorizationCheck, getUsers);

router.delete(
  "/user/:id/:staffRole",
  verifyUser,
  authorizationCheck,
  deleteUser
);
router.put(
  "/user/captain",
  verifyUser,
  authorizationCheck,
  assignUserAreaAndStatus
);
//authorizationCheck
router.put("/user", verifyUser, updateUser);
router.post("/login", passport.authenticate("local"), login);

//get user profile

//inventory
// router.post("/inventory/bulk", upload.single("inventory"), addBulkInventory);
router.post("/inventory", verifyUser, authorizationCheck, addInventory);
router.put("/inventory", verifyUser, authorizationCheck, updateInventory);
router.get("/inventory", verifyUser, authorizationCheck, getInventories);
router.get(
  "/inventory/:id",
  authorizationCheck,
  verifyUser,
  authorizationCheck,
  getInventory
);
router.delete(
  "/inventory/:id",
  verifyUser,
  authorizationCheck,
  deleteInventory
);

//table
router.post("/table", verifyUser, authorizationCheck, addTable);
router.put("/table", verifyUser, authorizationCheck, updateTable);
router.get("/table", getTables);
router.get("/table/:id", verifyUser, authorizationCheck, getTable);
router.delete("/table/:id", verifyUser, authorizationCheck, deleteTable);

// //order
router.post("/order/waiting", verifyUser, authorizationCheck, addWaitingOrder);
router.put(
  "/order/waiting",
  verifyUser,
  authorizationCheck,
  updateWaitingOrder
);
router.get("/order/waiting", verifyUser, authorizationCheck, getWaitingOrders);
router.get(
  "/order/waiting/:id",
  verifyUser,
  authorizationCheck,
  getWaitingOrder
);
router.delete(
  "/order/waiting/:id",
  verifyUser,
  authorizationCheck,
  deleteWaitingOrder
);

// //order
router.post("/order", verifyUser, authorizationCheck, addOrder);
router.put("/order", verifyUser, authorizationCheck, updateOrder);
router.put("/order/food", verifyUser, authorizationCheck, updateOrderItems);

router.get("/order", getOrders);
router.get("/order/:id", verifyUser, authorizationCheck, getOrder);

router.post("/kitchen", addKitchen);
router.put("/kitchen", verifyUser, authorizationCheck, updateKitchen);
router.get("/kitchen", verifyUser, authorizationCheck, getKitchens);
router.get("/kitchen/:id", verifyUser, authorizationCheck, getKitchen);
router.delete("/kitchen/:id", verifyUser, authorizationCheck, deleteKitchen);

router.get("/static/upload", upload.single("food"), addStaticImage);

// //order
router.post(
  "/food",
  verifyUser,
  authorizationCheck,
  upload.single("image"),
  addFoodProduct
);
router.post(
  "/food/bulk",
  verifyUser,
  authorizationCheck,
  upload.single("food"),
  addBulkFood
);

router.post(
  "/food/update",
  verifyUser,
  authorizationCheck,
  upload.single("image"),
  updateFoodProduct
);
router.get("/food", verifyUser, authorizationCheck, getFoodProducts);
router.get("/food/:id", verifyUser, authorizationCheck, getFoodProduct);
router.delete("/food/:id", verifyUser, authorizationCheck, deleteFoodProduct);

export default router;
