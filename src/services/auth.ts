import createHttpError from "http-errors";
import UsersCollection from "../db/models/User";
import { AuthUserType, UserType } from "../types/auth";
import bcrypt from "bcryptjs";
import SessionCollection from "../db/models/Session";
//crypto is build in express;
import { randomBytes } from "crypto";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users";
//ObjectId type from mongoose and from mongodb are different and don't work for the same purposes
import { ObjectId } from "mongodb";
import {Types} from "mongoose";

const createSession = async (userId: string) => {
    //should be better that delete one
    await SessionCollection.deleteMany({ userId });
    const accessToken = randomBytes(30).toString("base64");
  //check pattern called Refresh Token Rotation (RTR) in the future
  const refreshToken = randomBytes(30).toString("base64");
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  }
}
export const signup = async (payload: UserType) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, "Email is already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  return UsersCollection.create({ ...payload, password: hashPassword });
};

export const signin = async ({ email, password }: UserType) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, "Email is incorrect");
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw createHttpError(401, "Password is incorrect");
  }

//   await SessionCollection.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id.toString())
  return SessionCollection.create({
    userId: user._id,
    ...newSession
  });
};

//this request is for authenticate.ts middleware to check if token is valid and exists in one of the sessions
export const findSession = (filter: { accessToken: string }) =>
  SessionCollection.findOne(filter);
export const findUser = (filter: { _id: ObjectId }) =>
  UsersCollection.findById(filter).lean<AuthUserType>();

export const refreshUserSession = async ({
  sessionId,
  refreshToken,
}: {
  sessionId?: string;
  refreshToken?: string;
}) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }
  if (Date.now() > session.refreshTokenValidUntil.getTime()) {
    throw createHttpError(401, "Refresh token has expired");
  }
//   await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = await createSession(session.userId.toString())
  return SessionCollection.create({
    userId: session.userId,
    ...newSession
  })
};
