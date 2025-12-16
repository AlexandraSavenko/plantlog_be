import { AuthUserType } from "./auth";


declare global{
    namespace Express {
        interface Request {
            user?: AuthUserType,
            userEmail?: string,
            cookies: {
                sessionId?: string,
                refreshToken?: string 
            }
        }
    }
}

export{};