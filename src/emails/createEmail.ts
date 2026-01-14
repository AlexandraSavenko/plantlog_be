import * as path from "node:path";
import { TEMPLATE_DIR } from "../constants/emailVerification";
import {env} from "../utils/env";
import * as fs from "node:fs/promises";
import Handlebars from "handlebars";
import { EmailTemplate } from "../types/auth";



export const createEmail = async (email: string, context: Record<string, unknown>, templateName: EmailTemplate) => {
//we need to read the content of the html file with email and transform it from binary to text
const emailTemplatePath = path.join(TEMPLATE_DIR, templateName)
  
const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
  //next handlebars template needs to be created. Handlears turns text to object
  const html = Handlebars.compile(templateSource)(context)
  //html content of the letter needs to be created --> we call template as a function and pass content
  //and this html goes as verifyEmail.html
  // const html = template({link: `${appDomain}/auth/verify?token=${token}`})
    const verifyEmail = {
      to: email,
      subject: "Plantlog email verification",
      html
    }
    return verifyEmail;
}
