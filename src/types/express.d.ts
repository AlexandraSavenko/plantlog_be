import { AuthUserType } from "./auth";


declare global{
    namespace Express {
        interface Request {
            user?: AuthUserType
        }
    }
}

export{};