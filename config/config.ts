import { Secret } from "jsonwebtoken";

export const SECRET_KEY: Secret =
  "jcefhfurhchasjxbwedgyewgdqewbytewyudqewdqed6qs8732e234e2346hg";
export const DB_URL: string =
  "mongodb+srv://htsdigitalsolutions:HTS1717@cluster0.gwccj9n.mongodb.net/test?retryWrites=true&w=majority";
export const DB_URL_DEV: string = "localhost:27017";

export const DB_NAME: string = "RCMSDB";

//permissions Type
export const CREATE = "CREATE";
export const READ = "READ";
export const UPDATE = "UPDATE";
export const DELETE = "DELETE";
export const ALL = "ALL";

//permissions Array
//roles
export const DIRECTOR: string = "DIRECTOR";
export const OPERATIONAL_MANAGER: string = "OPERATIONAL_MANAGER";
export const ADMIN: string = "ADMIN";
export const FB_MANAGER: string = "FB_MANAGER";
// export const MANAGER: string = "MANAGER";
export const CASHIER: string = "CASHIER";
export const CAPTAIN: string = "CAPTAIN";
export const WAITER: string = "WAITER";

//actions
export const INVENTORY: string = "INVENTORY";
export const FOOD: string = "FOOD";
export const TABLE: string = "TABLE";
export const KITCHEN: string = "KITCHEN";

export const ORDER: string = "ORDER";
export const REPORTS: string = "REPORTS";
export const USER_MANAGEMENT: string = "USER_MANAGEMENT";

//shift
export const DAY_SHIFT = "Day";
export const NIGHT_SHIFT = "Night";
