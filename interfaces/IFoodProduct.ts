import { Document } from "mongoose"
import { PRODUCT_CATEGORIES, PRODUCT_QUALITIES } from "../config/enums"

export interface IFoodProduct extends Document{
    name: string,
    image:string,
    description: string,
    quantity: PRODUCT_QUALITIES,
    isVeg:boolean,
    category: PRODUCT_CATEGORIES,
    price: number,
    discount?: number
    isReadyToServe?: boolean,
    rating?: number,
    tag?: string //bestseller
    isAvailable?: boolean,
    expiryDate?:string
}

