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
import { responseObj } from "../../helper/response";
import { HTTP_RESPONSE } from "../../helper/constants";
import {
  addTable,
  deleteTable,
  getTable,
  getTables,
  updateTable,
} from "../../controllers/tableController/table";
import {
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
  addFoodProduct,
  deleteFoodProduct,
  getFoodProduct,
  getFoodProducts,
  updateFoodProduct,
} from "../../controllers/foodController/food";
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
router.post("/inventory", verifyUser, addInventory);
router.put("/inventory", verifyUser, updateInventory);
router.get("/inventory", verifyUser, getInventories);
router.get("/inventory/:id", verifyUser, getInventory);
router.delete("/inventory/:id", verifyUser, deleteInventory);

// //food product
// router.post("/product", auth, addFoodProduct);
// router.put("/product", auth, updateFoodProduct);
// router.get("/product", getFoodProducts);
// router.get("/product/:id", getFoodProduct);
// router.delete("/product/:id", auth, deleteFoodProduct);

//table
router.post("/table", verifyUser, addTable);
router.put("/table", verifyUser, updateTable);
router.get("/table", verifyUser, getTables);
router.get("/table/:id", verifyUser, getTable);
router.delete("/table/:id", verifyUser, deleteTable);
// //order
router.post("/order", verifyUser, addOrder);
router.put("/order", verifyUser, updateOrder);
router.get("/order", verifyUser, getOrders);
router.get("/order/:id", verifyUser, getOrder);

router.get("/static/upload", upload.single("food"), addStaticImage);

// //order
router.post("/food", verifyUser, upload.single("image"), addFoodProduct);
router.put("/food", verifyUser, updateFoodProduct);
router.get("/food", verifyUser, getFoodProducts);
router.get("/food/:id", verifyUser, getFoodProduct);
router.delete("/food/:id", verifyUser, deleteFoodProduct);

export default router;
