import express from "express";
import {
  addUser,
  assignUserAreaAndStatus,
  deleteUser,
  getUsers,
  login,
  profile,
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
const router = express.Router();

//user
router.post("/user", verifyUser, addUser);
router.post("/user/:staffRole", verifyUser, getUsers);

router.delete("/user", verifyUser, deleteUser);
router.put("/user/manager", verifyUser, assignUserAreaAndStatus);
router.post("/login", passport.authenticate("local"), login);

//get user profile
router.get("/user/profile", verifyUser, profile);

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

// //employees
// router.post("/employee", auth, addEmployee);
// router.put("/employee", auth, updateEmployee);
// router.get("/employee", auth, getEmployees);
// router.get("/employee/:id", auth, getEmployee);
// router.delete("/employee/:id", auth, deleteEmployee);

// //employees
// router.post("/customer", addCustomer);
// router.get("/customer", auth, getCustomers);
// router.get("/customer/:id", auth, getCustomer);

// //order
// router.post("/order", addOrder);
// router.put("/order", auth, updateOrder);
// router.get("/order", auth, getOrders);
// router.get("/order/:id", auth, getOrder);

// //kitchen
// router.post("/kitchen", auth, addKitichan);
// router.get("/kitchen", auth, getKitchans);
// router.get("/kitchen/:id", auth, getKitchan);

// //kitichen
// router.post("/kitchen/employee", auth, addEmployeeToKitchan);

// //inventory
// router.post("/inventory",auth, addInventory);
// router.put("/inventory", auth, updateInventory);
// router.get("/inventory", auth, getInventorys);
// router.get("/inventory/:id", auth, getInventory);

// router.post("/inventory/csv",auth,upload.single("inventories"), addBulkInventory);

export default router;
