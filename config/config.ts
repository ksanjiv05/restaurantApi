import { Secret } from "jsonwebtoken";

export const SECRET_KEY: Secret =
  "jcefhfurhchasjxbwedgyewgdqewbytewyudqewdqed6qs8732e234e2346hg";
export const DB_URL: string = "mongodb+srv://htsdigitalsolutions:HTS1717@cluster0.gwccj9n.mongodb.net/?retryWrites=true&w=majority";
export const DB_URL_DEV: string = "localhost:27017";

export const DB_NAME: string = "RCMSDB";

//roles
export const DIRECTOR: string = "DIRECTOR";
export const OPERATIONAL_MANAGER: string = "OPERATIONAL_MANAGER";
export const ADMIN: string = "ADMIN";
export const FB_MANAGER: string = "FB_MANAGER";
export const MANAGER: string = "MANAGER";
export const CASHIER: string = "CASHIER";
export const CAPTAIN: string = "CAPTAIN";

//actions
export const INVENTORY: string = "INVENTORY";
export const ORDER: string = "ORDER";
export const REPORTS: string = "REPORTS";
// export const USER_MANAGEMENT: string = "USER_MANAGEMENT";
