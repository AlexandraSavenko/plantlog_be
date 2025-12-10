import UsersCollection from "../db/models/User"
import { UserType } from "../types/auth"

export const signup = async ( payload: UserType) => {
return UsersCollection.create(payload)
}