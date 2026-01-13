import * as path from "node:path";
import { TEMPLATE_DIR } from "../constants/emailVerification";
import {env} from "../utils/env";
import * as fs from "node:fs/promises";
import Handlebars from "handlebars";

const appDomain = env("APP_DOMAIN");
//console.log(emailTemplatePath) --> D:\Projects\plantlog_be\src\templates\verify-email.html

export const createEmail = async (email: string, token: string, templateName: string) => {
//we need to read the content of the html file with email and transform it from binary to text
const emailTemplatePath = path.join(TEMPLATE_DIR, )
  
const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
  //next handlebars template needs to be created. Handlears turns text to object
  const template = Handlebars.compile(templateSource)
  //html content of the letter needs to be created --> we call template as a function and pass content
  //and this html goes as verifyEmail.html
  const html = template({link: `${appDomain}/auth/verify?token=${token}`})
    const verifyEmail = {
      to: email,
      subject: "Plantlog email verification",
      html
    }
    return verifyEmail;
}
