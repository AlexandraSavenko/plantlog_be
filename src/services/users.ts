import { Types } from "mongoose"
import UsersCollection from "../db/models/User"

export const getUserInfo = async (userId: Types.ObjectId) => {
return UsersCollection.findById(userId)
}