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

export const csvToJson = async (filePath: string) => {
  try {
    const jsonArray = await csv().fromFile(filePath);
    return jsonArray.map((item) => ({
      name: item.field1,
      price: item.field2,
      image: "https://picsum.photos/200/300",
      quantity: 1,
      isVeg:
        item.field1.includes("VEG") ||
        item.field1.includes("VAG") ||
        item.field1.includes("PANEER"),
    }));
  } catch (err) {
    logging.error("CSV TO JSON", "unable to parse csv", err);
    return [];
  }
};
