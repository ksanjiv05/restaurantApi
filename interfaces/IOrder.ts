import {Document} from "mongoose"
import { ORDER_STATUS } from "../config/enums"

export interface IOrder extends Document{
    pids:string[],
    kid:string,
    tableNumber:number,
    tableId:string,
    customerId:string,
    status:ORDER_STATUS
    cafeId?:string,
    waiterId?:string,
    waitingTime:string
}
