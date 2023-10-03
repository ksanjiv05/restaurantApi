import express from "express";
import {
  addUser,
  assignUserAreaAndStatus,
  deleteUser,
  login,
} from "../../controllers/authController/auth";

import { upload } from "../../middelware/uploder";
import passport from "passport";
import { verifyUser } from "../../middelware/auth";
const router = express.Router();

//user
router.post("/user", verifyUser, addUser);
router.delete("/user", verifyUser, deleteUser);
router.put("/user/manager", verifyUser, assignUserAreaAndStatus);
router.post("/login", passport.authenticate("local"), login);

// //food product
// router.post("/product", auth, addFoodProduct);
// router.put("/product", auth, updateFoodProduct);
// router.get("/product", getFoodProducts);
// router.get("/product/:id", getFoodProduct);
// router.delete("/product/:id", auth, deleteFoodProduct);

// //table
// router.post("/table", auth, addTable);
// router.put("/table", auth, updateTable);
// router.get("/table", getTables);
// router.get("/table/:id", getTable);
// router.delete("/table/:id", auth, deleteTable);

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
