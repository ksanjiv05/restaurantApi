import fs from "fs";
import { parse } from "csv-parse";
import csv from "csvtojson";
import logging from "../config/logging";

export const csvParser = async (filePath: string) => {
  const reader = fs
    .createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 2 }));

  let data = [];
  for await (const row of reader) {
    data.push(row);
  }
  return data;
};

// name: string;
//   image: string;
//   code: string;
//   isVeg: boolean;
//   category: string;
//   subCategory: string;
//   price: number;
//   isReadyToServe?: boolean;
//   tag?: string; //bestseller
//   isAvailable?: boolean;
//   expiryDate?: string;

export const foodCsvToJson = async (filePath: string) => {
  try {
    console.log("filePath", filePath);
    const jsonArray = await csv().fromFile(filePath);
    return jsonArray.map((item) => {
      console.log("item", item);
      return {
        name: item?.Name,
        price: item?.Price,
        image: item?.Image,
        code: item?.Code,
        category: item?.Category,
        subCategory: item?.Subcategory,
        department: item?.Department,
        quantity: 1,
        isVeg: !item["Veg/non-veg"]?.includes("non-veg"),
      };
    });
  } catch (err) {
    logging.error("CSV TO JSON", "unable to parse csv", err);
    return [];
  }
};
