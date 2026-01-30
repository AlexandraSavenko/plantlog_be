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
    // redirectUri: oauthConfig.web.redirect_uris[0],
    redirectUri: "postmessage"
  });
//there could be two ways to get google code, for backend request redirectUri should be oauthConfig, while for front-end request it should be "postmessage"
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
    console.log("Code", code)
  const client = await getGoogleOAuthClient();
//   console.log("Client", client)
  let response;
  try {
   response = await client.getToken(code);
  console.log("Response on code", response) 

  } catch (error) {
    console.log("error on code", error)
    throw error;
  }
  
  const token = response?.tokens.id_token
  if(!token){
throw createHttpError(401);
  }

  //jwt.io
  //instead of decoding the token it should be sent to google to get info about user

const ticket = await client.verifyIdToken({
    idToken: token
})
// console.log("Valid code here is your ticket", ticket)
return ticket;
};
