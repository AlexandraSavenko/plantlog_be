import createHttpError from "http-errors";
import UsersCollection from "../db/models/User";
import { AuthUserType, UserType } from "../types/auth";
import bcrypt from "bcryptjs";
import SessionCollection from "../db/models/Session";
//crypto is express built-in;
import { randomBytes } from "crypto";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users";
//ObjectId type from mongoose and from mongodb are different and don't work for the same purposes
import { ObjectId } from "mongodb";
import {Types} from "mongoose";
//email-verification
import { sendEmail } from "../utils/sendEmail";

// import * as path from "node:path";
// import { TEMPLATE_DIR } from "../constants/emailVerification";
//what is this I've no idea
// import * as fs from "node:fs/promises";
// import Handlebars from "handlebars";
// import {env} from "../utils/env"
import { createJWT } from "../utils/jwt";
import { createEmail } from "../emails/createEmail";
import { validateCode } from "../utils/googleOAuth2";

// const emailTemplatePath = path.join(TEMPLATE_DIR, "verify-email.html")
// const appDomain = env("APP_DOMAIN");
// //console.log(emailTemplatePath) --> D:\Projects\plantlog_be\src\templates\verify-email.html
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
  const user = await findUserByEmail({ email });
  if (user) {
    throw createHttpError(409, "Email is already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({ ...payload, password: hashPassword });
  
  const jwtToken = createJWT(email)
  const verifyEmail = await createEmail(email, jwtToken)
  await sendEmail(verifyEmail);
  return newUser;
};

export const verifyUser = async (email: string) => {
const user = await findUserByEmail({email})
if(!user){
  throw createHttpError(404, "User not found!")
}
const data = await UsersCollection.findByIdAndUpdate(user._id, {verify: true})
return data;
};

export const signin = async ({ email, password }: UserType) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, "Email is incorrect");
  }
  if(!user.verify){
    throw createHttpError(401, "You need to verify your email")
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
export const findUserById = (filter: { _id: ObjectId }) =>
  UsersCollection.findById(filter).lean<AuthUserType>();

const findUserByEmail = (filter: {email: string}) => UsersCollection.findOne(filter)

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

export const signout = async (sessionId: string) => {
  //even if there was no session, it can't hurt anyone
await SessionCollection.deleteOne({_id: sessionId})
}

export const signInOrUpWithGoogle = async (code: string) => {
const signTicket = await validateCode(code);
//information in ticket is hidden so it should be decoded
const payload = signTicket.getPayload();
if(!payload){
  throw createHttpError(401)
}
//now sign in vs sign up logics needs to be worked through

let user = await UsersCollection.findOne({
  email: payload.email
})
if(!user){
  const password = await bcrypt.hash(randomBytes(10).toString("hex"), 10)
  user = await UsersCollection.create({
    email: payload.email,
    username: "",
    password
  })
}

const newSession = await createSession(user._id.toString())
  return SessionCollection.create({
    userId: user._id,
    ...newSession
  });
}