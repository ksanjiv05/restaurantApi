import { Document } from "mongoose";
import {  CAFE_SKILL, EMOPLOYEE_ROLES } from "../config/enums";

export interface IEmployee extends Document {
  name: string;
  phoneNumber: string;
  email?: string;
  address: string;
  jobTitle: string;
  // isCafe: boolean;
  skill: CAFE_SKILL;
  payScale?: number;
  workingHours?: number;
  role:EMOPLOYEE_ROLES; //(managers/waiter/cafe)
  maxQulification?: string;
  joiningDate: string;
  inLeave: boolean; //(leave/available)
  rating: number;
  password:string
}
