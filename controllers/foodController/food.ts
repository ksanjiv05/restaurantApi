import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IFoodProduct } from "../../interfaces/IFoodProduct";
import FoodProduct from "../../models/FoodProduct";

export const addFoodProduct = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const {
      name = "",
      image = "",
      price = 0,
      expiryDate = "",
      isReadyToServe = false,
      category = "",
    }: IFoodProduct = req.body;

    // if (name == "" || price == 0 || category == "") {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: "please provide a valid name, image, price and category",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    const date = new Date(expiryDate);

    // if (
    //   isReadyToServe &&
    //   (expiryDate == undefined ||
    //     expiryDate == "" ||
    //     date.getTime() <= new Date().getTime())
    // ) {
    //   return responseObj({
    //     statusCode: HTTP_RESPONSE.BED_REQUEST,
    //     type: "error",
    //     msg: "please add valid expiry date to beacuse this is ready to serve food product",
    //     error: null,
    //     resObj: res,
    //     data: null,
    //   });
    // }
    req.body.image = file?.filename;
    const newFoodProduct: IFoodProduct = new FoodProduct(req.body);
    let error: any = newFoodProduct.validateSync();
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
    if (error) {
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
    const { page = 0, perPage = 10 } = req.query;
    // page //perPage
    const skip = (Number(page) - 1) * Number(perPage);

    const FoodProducts = await FoodProduct.find()
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(perPage));
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Food Products",
      error: null,
      resObj: res,
      data: FoodProducts,
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
