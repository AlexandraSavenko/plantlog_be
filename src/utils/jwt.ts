import jwt from "jsonwebtoken";
import { envString } from "./env";

export const createJWT = (email: string) => {
  const jwtSecret = envString("JWT_SECRET");

 return jwt.sign({ email }, jwtSecret, { expiresIn: "24h" });
};
