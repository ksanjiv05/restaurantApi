import {Document} from "mongoose"

export interface ITable extends Document{
    kid:string;
    availableSeats?:number,
    totalSeats:number,
    about?:string,
    tableNumber:number
}