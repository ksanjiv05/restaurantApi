import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IFoodProduct } from "../../interfaces/IFoodProduct";
import FoodProduct from "../../models/FoodProduct";
import { foodCsvToJson } from "../../helper/utils";
import { DEPARTMENT } from "../../config/enums";

export const addBulkFood = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a csv file",
        error: null,
        resObj: res,
        data: null,
      });

    const csvData: IFoodProduct[] = await foodCsvToJson(req.file?.path);
    // console.log("csvData", csvData);
    const response = await FoodProduct.bulkWrite(
      csvData.map((doc: IFoodProduct) => {
        let docupdated = { ...doc };
        return {
          insertOne: {
            document: docupdated,
          },
        };
      })
    );

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully uploaded Inventories",
      error: null,
      resObj: res,
      data: response,
    });
  } catch (error: any) {
    logging.error("Add Bulk Inventory", "unable to add Inventory", error);

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

export const addFoodProduct = async (req: Request, res: Response) => {
  try {
    // const file = req.file;

    // req.body.image = file?.filename;
    const { price = [] } = req.body;
    if (price.length < 1) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "department wise price is needed",
        error: null,
        resObj: res,
        data: null,
      });
    }

    // console.log("___",price)
    // const arrObj = price.map(v=>({
    //   ...v,
    //   ...req.body
    // }))
    // console.log("++_",arrObj)
    const newFoodProduct: IFoodProduct = new FoodProduct(req.body);
    let error: any = newFoodProduct.validateSync();
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
    await newFoodProduct.save();
    // console.log("many",many)
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Food Product",
      error: null,
      resObj: res,
      data: newFoodProduct,
    });
  } catch (error) {
    logging.error("Add Food Product", "unable to add Food Product", error);
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

export const updateFoodProduct = async (req: Request, res: Response) => {
  try {
    const { _id = "" } = req.body;
    const file = req.file;
    if (file) {
      req.body.image = file?.filename;
    }
    console.log("__", req.body);
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid FoodProduct ID",
        error: null,
        resObj: res,
        data: null,
      });

    await FoodProduct.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Food Product",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Update FoodProduct", "unable to update Food Product", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("Cast to ObjectId failed")
          ? "Please provide valid product id"
          : error?.message,
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

export const getFoodProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 0,
      perPage = 10,
      isVeg = "",
      department = "",
      isTable = false,
    } = req.query;
    const skip = (Number(page) - 1) * Number(perPage);
    console.log("skip", isVeg, skip, page, perPage);
    let FoodProducts = null;
    const filter = {
      ...(isVeg == "" ? {} : { isVeg }),
      // ...(department == DEPARTMENT.UNKNOWN ? {} : { department }),
    };
    let count = 0;
    if (isTable) {
      if (perPage !== "all") {
        FoodProducts = await FoodProduct.find({})
          .sort("-createdAt")
          .skip(Number(skip))
          .limit(Number(perPage));
        count = await FoodProduct.find().count();
      } else {
        FoodProducts = await FoodProduct.find({});
        count = await FoodProduct.find().count();
      }
    } else {
      if (perPage !== "all") {
        FoodProducts = await FoodProduct.aggregate([
          // { $match: {} },
          { $unwind: "$price" },
          { $match: { "price.department": department } },
          { $sort: { createdAt: -1 } },
        ]);
      } else {
        let departmentLower = department.toString().toLocaleLowerCase();
        console.log("departmar-- ", departmentLower);
        FoodProducts = await FoodProduct.aggregate([
          { $match: {} },
          { $unwind: "$price" },
          { $match: { "price.department": departmentLower } },
          // { $sort: { createdAt: -1 } },
        ]);
        count = FoodProducts.length;

        // FoodProducts = await FoodProduct.aggregate([
        //   { $match: { "price.department": departmentLower } },
        //   {
        //     $replaceWith: {
        //       $arrayElemAt: [
        //         {
        //           $filter: {
        //             input: "$price",
        //             cond: { $eq: ["$$this.department", departmentLower] },
        //           },
        //         },
        //         0,
        //       ],
        //     },
        //   },
        // ]);

        console.log(
          "departmar ",
          department,
          departmentLower,
          FoodProducts,
          "++++++++"
          // FoodProductsx
        );
      }
    }
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Food Products",
      error: null,
      resObj: res,
      data: {
        products: FoodProducts,
        total: count,
      },
    });
  } catch (error) {
    logging.error("Get Food Products", "unable to get Food Products", error);
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

export const getFoodProduct = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid FoodProduct ID",
        error: null,
        resObj: res,
        data: null,
      });
    const foodProduct = await FoodProduct.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Food Product",
      error: null,
      resObj: res,
      data: foodProduct,
    });
  } catch (error: any) {
    logging.error("Get Food Product", "unable to get FoodProduct", error);
    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("Cast to ObjectId failed")
          ? "Please provide valid product id"
          : error?.message,
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

export const deleteFoodProduct = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid FoodProduct ID",
        error: null,
        resObj: res,
        data: null,
      });
    await FoodProduct.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Food Product is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Delete Food Product", "unable to delete FoodProduct", error);
    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("Cast to ObjectId failed")
          ? "Please provide valid product id"
          : error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    }

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
