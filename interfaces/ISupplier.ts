import {Document} from "mongoose"

export interface ISupplier extends Document{
    name: string;
    contactNumber: string;
    email: string;
    companyName: string;
    address: string;
}
