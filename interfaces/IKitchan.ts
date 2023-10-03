import {Document} from "mongoose"
import { CAFE_SKILL } from "../config/enums"

type CAFE_PROPS={
    id: string,
    skill:CAFE_SKILL
    assignedOrders: string[],//order ids
}

type WAITER_PROPS={
    id: string,
    assignedOrders: string[],//order ids
}

export interface IKitchan extends Document{
    kid: string,
    resturantName: string,
    kName: string,
    cafes:CAFE_PROPS[],
    waiters:WAITER_PROPS[],
    isOpen?:boolean
}