import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IKitchen } from "../../interfaces/IKitchen";
import Kitchen from "../../models/Kitchen";
import { DEPARTMENT } from "../../config/enums";

export const addKitchen = async (req: Request, res: Response) => {
  try {
    const newKitchen: IKitchen = new Kitchen({
      ...req.body,
    });

    let error: any = newKitchen.validateSync();
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
    await newKitchen.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Kitchen",
      error: null,
      resObj: res,
      data: newKitchen,
    });
  } catch (error: any) {
    logging.error("Add Kitchen", "unable to add Kitchen", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")
          ? "duplicate Kitchen "
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

export const updateKitchen = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Kitchen ID",
        error: null,
        resObj: res,
        data: null,
      });

    await Kitchen.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Kitchen",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Kitchen", "unable to update Kitchen", error);
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

export const getKitchens = async (req: Request, res: Response) => {
  try {
    const {
      page = 0,
      perPage = 10,
      department = DEPARTMENT.UNKNOWN,
    } = req.query;
    // page //perPage
    const skip = (Number(page) - 1) * Number(perPage);

    let count = 0;
    const kitchens = await Kitchen.find({})
      .skip(Number(skip))
      .limit(Number(perPage));
    count = await Kitchen.find({}).count();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Kitchens",
      error: null,
      resObj: res,
      data: {
        Kitchens: kitchens,
        total: count,
      },
    });
  } catch (error) {
    logging.error("Get Kitchens", "unable to get Kitchens", error);
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

export const getKitchen = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Kitchen ID",
        error: null,
        resObj: res,
        data: null,
      });
    const kitchen = await Kitchen.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Kitchen",
      error: null,
      resObj: res,
      data: kitchen,
    });
  } catch (error) {
    logging.error("Get Kitchen", "unable to get Kitchen", error);
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

export const deleteKitchen = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Kitchen ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Kitchen.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Kitchen is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Kitchen", "unable to delete Kitchen", error);
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
