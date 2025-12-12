import { Types } from "mongoose";

export interface UserType {
    username?: string;
    email: string;
    password: string;
}

export interface AuthUserType {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
}