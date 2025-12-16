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
//email-verification
import { sendEmail } from "../utils/sendEmail";

import * as path from "node:path";
import { TEMPLATE_DIR } from "../constants/emailVerification";
//what is this I've no idea
import * as fs from "node:fs/promises";
import Handlebars from "handlebars";
import {env} from "../utils/env"
import { createJWT } from "../utils/jwt";

const emailTemplatePath = path.join(TEMPLATE_DIR, "verify-email.html")
const appDomain = env("APP_DOMAIN");
//console.log(emailTemplatePath) --> D:\Projects\plantlog_be\src\templates\verify-email.html
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
  const newUser = await UsersCollection.create({ ...payload, password: hashPassword });

  //we need to read the content of the html file with email and transform it from binary to text
  const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
  //next handlebars template needs to be created. Handlears turns text to object
  const template = Handlebars.compile(templateSource)
  //html content of the letter needs to be created --> we call template as a function and pass content
  //and this html goes as verifyEmail.html
  const jwtToken = createJWT(email)
  const html = template({link: `${appDomain}/auth/verify?token=${jwtToken}`})
  const verifyEmail = {
    to: email,
    subject: "Plantlog email verification",
    html
  }
  await sendEmail(verifyEmail);
  return newUser;
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

export const signout = async (sessionId: string) => {
  //even if there was no session, it can't hurt anyone
await SessionCollection.deleteOne({_id: sessionId})
}