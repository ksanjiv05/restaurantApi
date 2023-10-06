import { DB_NAME, DB_URL, DB_URL_DEV } from "../config/config";
const Mongoose = require("mongoose");

const connection = Mongoose.connect(
  // "mongodb://" + DB_URL_DEV + "/" + DB_NAME + "?retryWrites=true",
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

connection
  .then(() => {
    console.log("db connected");
  })
  .catch((err: any) => {
    console.log("connection err ", err);
  });
