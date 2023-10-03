// import { Request, Response } from "express";
// import logging from "../../config/logging";
// import { HTTP_RESPONSE } from "../../helper/constants";
// import { responseObj } from "../../helper/response";
// import { IInventory } from "../../interfaces/IInventory";
// import Inventory from "../../models/Inventory";
// import { csvToJson } from "../../helper/utils";

// export const addBulkInventory = async (req: Request, res: Response) => {
//   try {
//     if (!req.file)
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide a csv file",
//         error: null,
//         resObj: res,
//         data: null,
//       });

//     const csvData = await csvToJson(req.file?.path);

//     const response = await Inventory.bulkWrite(csvData.map((doc:IInventory)=>{
//       let docupdated= {...doc,inStock: doc.quantity>0};
//       return {
//         insertOne:{
//           document:docupdated
//         }
//       }
//     }))

//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "hey, you are successfully uploaded Inventories",
//       error: null,
//       resObj: res,
//       data: response,
//     });
//   } catch (error: any) {
//     logging.error("Add Bulk Inventory", "unable to add Inventory", error);

//     if (error?.message) {
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: error.message.includes("E11000 duplicate key")
//           ? "duplicate Inventory"
//           : error.message,
//         error: null,
//         resObj: res,
//         data: null,
//       });
//     }

//     return responseObj({
//       statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
//       type: "error",
//       msg: error?.message || "unable to process your request",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   }
// };

// export const addInventory = async (req: Request, res: Response) => {
//   try {
//     const {
//       title = "",
//       description = "",
//       productModel = "",
//       brand = "",
//       quantity = 0,
//       price = 0,
//       expiration = "",
//     }: IInventory = req.body;

//     if (
//       title == "" ||
//       productModel == "" ||
//       brand == "" ||
//       quantity == 0 ||
//       price == 0 ||
//       expiration == "" ||
//       description == ""
//     ) {
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide valid data object",
//         error: null,
//         resObj: res,
//         data: null,
//       });
//     }

//     const expdate = new Date(expiration).toDateString();
//     const inStock = quantity > 0;
//     delete req.body.expiration;
//     delete req.body.inStock;

//     if (expdate.includes("Invalid"))
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide valid expiration date",
//         error: null,
//         resObj: res,
//         data: null,
//       });

//     const newInventory: IInventory = new Inventory({
//       ...req.body,
//       expiration: expdate,
//       inStock,
//     });
//     await newInventory.save();

//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "hey, you are successfully posted new Inventory",
//       error: null,
//       resObj: res,
//       data: newInventory,
//     });
//   } catch (error: any) {
//     logging.error("Add Inventory", "unable to add Inventory", error);

//     if (error?.message) {
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: error.message.includes("E11000 duplicate key")
//           ? "duplicate Inventory"
//           : error.message,
//         error: null,
//         resObj: res,
//         data: null,
//       });
//     }

//     return responseObj({
//       statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
//       type: "error",
//       msg: error?.message || "unable to process your request",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   }
// };

// export const updateInventory = async (req: Request, res: Response) => {
//   try {
//     const { _id = "" } = req.body;
//     if (_id == "")
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide a valid Inventory ID",
//         error: null,
//         resObj: res,
//         data: null,
//       });

//     await Inventory.updateOne(
//       { _id },
//       {
//         ...req.body,
//       }
//     );
//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "hey, you are successfully updated Inventory",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   } catch (error) {
//     logging.error("Update Inventory", "unaable to update Inventory", error);
//     return responseObj({
//       statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
//       type: "error",
//       msg: "unable to process your request",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   }
// };

// export const getInventorys = async (req: Request, res: Response) => {
//   try {
//     const inventorys = await Inventory.find();
//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "your Inventorys",
//       error: null,
//       resObj: res,
//       data: inventorys,
//     });
//   } catch (error) {
//     logging.error("Get Inventorys", "unaable to get Inventorys", error);
//     return responseObj({
//       statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
//       type: "error",
//       msg: "unable to process your request",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   }
// };

// export const getInventory = async (req: Request, res: Response) => {
//   try {
//     const { id = "" } = req.params;
//     if (id == "")
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide a valid Inventory ID",
//         error: null,
//         resObj: res,
//         data: null,
//       });
//     const inventory = await Inventory.findOne({ _id: id });
//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "your Inventory",
//       error: null,
//       resObj: res,
//       data: inventory,
//     });
//   } catch (error) {
//     logging.error("Get Inventory", "unable to get Inventory", error);
//     return responseObj({
//       statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
//       type: "error",
//       msg: "unable to process your request",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   }
// };

// export const deleteInventory = async (req: Request, res: Response) => {
//   try {
//     const { id = "" } = req.params;
//     if (id == "")
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide a valid Inventory ID",
//         error: null,
//         resObj: res,
//         data: null,
//       });
//     await Inventory.deleteOne({ _id: id });
//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "your Inventory is successfully deleted",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   } catch (error) {
//     logging.error("Delete Inventory", "unable to delete Inventory", error);
//     return responseObj({
//       statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
//       type: "error",
//       msg: "unable to process your request",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   }
// };
