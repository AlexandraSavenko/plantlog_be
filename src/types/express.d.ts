// interface userId {
//     userId: stirng
// }
declare global{
    namespace Express {
        interface Request {
            user?: import("../types/auth").UserType
        }
    }
}

export{};