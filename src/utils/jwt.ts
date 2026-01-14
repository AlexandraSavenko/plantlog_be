import jwt, { JwtPayload } from "jsonwebtoken";
import { envString } from "./env";
import { EmailTokenPayload } from "../types/verification";
import createHttpError from "http-errors";

const jwtSecret = envString("JWT_SECRET");

export const createJWT = (email: string) => {
  return jwt.sign({ email }, jwtSecret, { expiresIn: "24h" });
  //as an option user._id could be added to token in subject: jwt.sign(
//   { email: user.email },
//   jwtSecret,
//   { subject: user._id.toString(), expiresIn: '1h' }
// );
};

export const checkJWT = (token: string): EmailTokenPayload => {
  const decoded = jwt.verify(token, jwtSecret);
  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("email" in decoded) ||
    typeof decoded.email !== "string"
  ){
    throw createHttpError(400, "Invalid token payload")
  }
return decoded as EmailTokenPayload;
};
