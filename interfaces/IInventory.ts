import {Document} from "mongoose"

export interface IInventory extends Document{
    image: string;
    title: string,
    description: string,
    productModel: string,
    brand: string,
    quantity: number,
    location: string,
    price: number,
    supplier: string,
    expiration:string,
    inStock: boolean
}
