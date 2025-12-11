import createHttpError from "http-errors";
import UsersCollection from "../db/models/User";
import { UserType } from "../types/auth";
import bcrypt from "bcryptjs";
import SessionCollection from "../db/models/Session";
//crypto is build in express;
import {randomBytes} from "crypto"
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users";

export const signup = async ( payload: UserType) => {
    const {email, password} = payload;
    const user = await UsersCollection.findOne({email});
    if(user){
        throw createHttpError(409, "Email is already in use")
    }
    const hashPassword = await bcrypt.hash(password, 10)
return UsersCollection.create({...payload, password: hashPassword})
}

export const signin = async ({email, password}: UserType) => {
const user =await UsersCollection.findOne({email})
if(!user){
throw createHttpError(401, "Email is incorrect");
}
const checkPassword = bcrypt.compare(password, user.password)
if(!checkPassword){
    throw createHttpError(401, "Password is incorrect");
}

await SessionCollection.deleteOne({userId: user._id});

const accessToken = randomBytes(30).toString("base64");
const refreshToken = randomBytes(30).toString("base64");
return SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime
})
}