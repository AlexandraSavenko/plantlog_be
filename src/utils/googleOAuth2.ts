import { OAuth2Client } from "google-auth-library";
import * as path from "node:path";
import { readFile } from "fs/promises";
import { envString } from "./env";
import createHttpError from "http-errors";

//JSON file google-auth.json should be read and some data from it should be taken

const googleOAuthSettingsPath = path.resolve("google-oauth.json");

const clientId = envString("GOOGLE_CLIENT_ID");
const clientSecret = envString("GOOGLE_CLIENT_SECRET");
let oauthClient: OAuth2Client | null = null;

const getGoogleOAuthClient = async () => {
  if (oauthClient) return oauthClient;

  const file = await readFile(googleOAuthSettingsPath, "utf-8");
  const oauthConfig = JSON.parse(file);

  const googleOAuthClient = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: oauthConfig.web.redirect_uris[0],
  });

  return googleOAuthClient;
};

export const generateAuthUrl = async () => {
  const client = await getGoogleOAuthClient();

  return client.generateAuthUrl({
    //scope tell google which information is needed
    scope: ["https://www.googleapis.com/auth/userinfo.email"],
  });
};

export const validateCode = async (code: string) => {
  const googleOAuthClient = new OAuth2Client();
  const response = await googleOAuthClient.getToken(code);
  const token = response.tokens.id_token
  if(!token){
throw createHttpError(401);
  }

  //jwt.io
  //instead of decoding the token it should be sent to google to get info about user

const ticket = await googleOAuthClient.verifyIdToken({
    idToken: token
})
return ticket;
};
