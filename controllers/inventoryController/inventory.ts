import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IInventory } from "../../interfaces/IInventory";
import Inventory from "../../models/Inventory";
// import { csvToJson } from "../../helper/utils";
import { KITCHEN } from "../../config/enums";
import Notification from "../../models/Notification";

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

//     // const csvData = await csvToJson(req.file?.path);

//     // const response = await Inventory.bulkWrite(
//     //   csvData.map((doc: IInventory) => {
//     //     let docupdated = { ...doc, inStock: doc.quantity > 0 };
//     //     return {
//     //       insertOne: {
//     //         document: docupdated,
//     //       },
//     //     };
//     //   })
//     // );

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

export const addInventory = async (req: Request, res: Response) => {
  try {
    const {
      quantity = 0,
      expiration = "",
      kitchen = [],
      kitchenWiseQuantity,
    }: IInventory = req.body;

    // if (
    //   name == "" ||
    //   brand == "" ||
    //   quantity == 0 ||
    //   price == 0 ||
    //   expiration == "" ||
    //   kitchen == KITCHEN.UNKNOWN
    // ) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: "please provide product name, brand, quantity, price, expiration, and assigned kitchen ",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }

    // const expdate = new Date(expiration).toDateString();

    // if (expdate.includes("Invalid"))
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: "please provide valid expiration date",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });

    if (kitchenWiseQuantity && kitchenWiseQuantity.length == 0) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide at least one productWiseQuantity",
        error: null,
        resObj: res,
        data: null,
      });
    }

    // const sum = kitchenWiseQuantity.reduce((v) => parseFloat(v?.quantity), 0);

    var sum = kitchenWiseQuantity.reduce((accumulator, currentValue) => {
      // console.log("accumulator ", accumulator, currentValue);
      return accumulator + currentValue.quantity;
    }, 0);
    // console.log("sum ", sum);
    const inStock = sum;
    delete req.body.expiration;
    delete req.body.inStock;

    const newInventory: IInventory = new Inventory({
      ...req.body,
      inStock,
    });
    let error: any = newInventory.validateSync();
    let errors = {};
    if (error) {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "errors",
        error: errors,
        resObj: res,
        data: null,
      });
    }

    await newInventory.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully added new Inventory",
      error: null,
      resObj: res,
      data: newInventory,
    });
  } catch (error: any) {
    logging.error("Add Inventory", "unable to add Inventory", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")
          ? "duplicate Inventory"
          : error.message,
        error: null,
        resObj: res,
        data: null,
      });
    }

    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message || "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { _id = "" } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Inventory ID",
        error: null,
        resObj: res,
        data: null,
      });

    var sum = req.body.kitchenWiseQuantity.reduce(
      (accumulator, currentValue) => {
        // console.log("accumulator ", accumulator, currentValue);
        return accumulator + currentValue.quantity;
      },
      0
    );
    // console.log("sum ", sum);
    const quantity = req.body.quantity;
    req.body.inStock = sum;

    await Inventory.updateOne(
      { _id },
      {
        ...req.body,
      }
    );

    if (req.body.minQuantityToNotification < sum) {
      const newNotification = new Notification({
        title: "Inventory running out notification",
        id: _id,
        action: "Pending",
        remark: "",
        actionPerformedBy: "n/a",
        actionPerformedId: "n/a",
        notificationType: "inventory",
        isActive: true,
      });
      await newNotification.save();
      global.socketObj?.emit("new_notification", {
        type: "success",
        msg: "Notification added successfully!",
        data: newNotification,
      });
    }

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Inventory",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Inventory", "unable to update Inventory", error);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const getInventories = async (req: Request, res: Response) => {
  try {
    const { page = 0, perPage = 10, kitchen = KITCHEN.UNKNOWN } = req.query;
    // page //perPage
    const skip = (Number(page) - 1) * Number(perPage);

    const filter = {
      ...(kitchen === KITCHEN.UNKNOWN ? {} : { kitchen }),
    };

    const inventories = await Inventory.find(filter)
      .skip(Number(skip))
      .limit(Number(perPage));
    const total = await Inventory.find(filter).count();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your inventories",
      error: null,
      resObj: res,
      data: { inventories, total },
    });
  } catch (error) {
    logging.error("Get Inventories", "unable to get Inventories", error);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const getInventory = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Inventory ID",
        error: null,
        resObj: res,
        data: null,
      });
    const inventory = await Inventory.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Inventory",
      error: null,
      resObj: res,
      data: inventory,
    });
  } catch (error) {
    logging.error("Get Inventory", "unable to get Inventory", error);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Inventory ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Inventory.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Inventory is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Inventory", "unable to delete Inventory", error);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

//pids
// productId: string;
// productName: string;
// quantity: number;
//  price: number;
//   allocatedKitchen: string;

const updateInventoryQuantity = async () => {
  try {
  } catch (error) {}
};
