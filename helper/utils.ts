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
    return jsonArray;
  } catch (err) {
    logging.error("CSV TO JSON", "unable to parse csv", err);
    return [];
  }
};
