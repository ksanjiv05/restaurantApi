import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { ITable } from "../../interfaces/ITable";
import Table from "../../models/Table";
import { DEPARTMENT } from "../../config/enums";

export const addTable = async (req: Request, res: Response) => {
  try {
    const {
      totalSeats = 0,
      department = DEPARTMENT.UNKNOWN,
      tableNumber = 0,
      isMerged = false,
    }: //   isSifted = false,
    ITable = req.body;

    if (isMerged) {
      if (!req.body.mergeTables || req.body.mergeTables.length == 0) {
        return responseObj({
          statusCode: HTTP_RESPONSE.BED_REQUEST,
          type: "error",
          msg: "please provide mergeTables",
          error: null,
          resObj: res,
          data: null,
        });
      }
    }

    if (
      totalSeats == 0 ||
      department == DEPARTMENT.UNKNOWN ||
      tableNumber == 0
    ) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide department, totalSeats, tableNumber",
        error: null,
        resObj: res,
        data: null,
      });
    }
    req.body.tid = isMerged
      ? `${department}-merge-${tableNumber}`
      : `${department}-${tableNumber}`;
    const newTable: ITable = new Table({
      ...req.body,
    });

    await newTable.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Table",
      error: null,
      resObj: res,
      data: newTable,
    });
  } catch (error: any) {
    logging.error("Add Table", "unable to add Table", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")
          ? "duplicate Table "
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

export const updateTableSingle = async (req: Request, res: Response) => {
  try {
    const { _id = "", occupied = 0 } = req.body;
    if (_id == "" || occupied == 0)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Table ID and occupied by pepole",
        error: null,
        resObj: res,
        data: null,
      });

    await Table.updateOne(
      { _id },
      {
        $set: {
          availableSeats: occupied,
        },
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Table",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Table", "unaable to update Table", error);
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

export const updateTable = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Table ID",
        error: null,
        resObj: res,
        data: null,
      });

    await Table.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Table",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Table", "unaable to update Table", error);
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

// export const siftTable = async (req: Request, res: Response) => {
//   try {
//     const { _id } = req.body;
//     if (_id == "")
//       return responseObj({
//         statusCode: HTTP_RESPONSE.BED_REQUEST,
//         type: "error",
//         msg: "please provide a valid Table ID",
//         error: null,
//         resObj: res,
//         data: null,
//       });

//     await Table.updateOne(
//       { _id },
//       {
//         ...req.body
//       }
//     );
//     return responseObj({
//       statusCode: HTTP_RESPONSE.SUCCESS,
//       type: "success",
//       msg: "hey, you are successfully updated Table",
//       error: null,
//       resObj: res,
//       data: null,
//     });
//   } catch (error) {
//     logging.error("Update Table", "unaable to update Table", error);
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

export const updateTables = async (req: Request, res: Response) => {
  try {
    const { tableArr = [] } = req.body;
    if (tableArr.length == 0)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid array of objects which has Table ID and occupied by pepole",
        error: null,
        resObj: res,
        data: null,
      });

    const bulk = Table.collection.initializeUnorderedBulkOp();
    tableArr.forEach((table: any) => {
      bulk
        .find({ _id: table._id })
        .updateOne({ $set: { availableSeats: table.occupied } });
    });
    await bulk.execute();
    // await Table.updateOne(
    //   { _id },
    //   {
    //     $set: {
    //       availableSeats: occupied,
    //     },
    //   }
    // );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Tables",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Table", "unable to update Tables", error);
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

export const getTables = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Tables",
      error: null,
      resObj: res,
      data: tables,
    });
  } catch (error) {
    logging.error("Get Tables", "unable to get Tables", error);
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

export const getTable = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Table ID",
        error: null,
        resObj: res,
        data: null,
      });
    const table = await Table.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Table",
      error: null,
      resObj: res,
      data: table,
    });
  } catch (error) {
    logging.error("Get Table", "unable to get Table", error);
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

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Table ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Table.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Table is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Table", "unable to delete Table", error);
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
