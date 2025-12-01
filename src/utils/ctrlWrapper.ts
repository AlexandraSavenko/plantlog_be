import { Request, Response, NextFunction } from "express";


//ctrlWrapper is a decorator -- function that wraps other functions
type Controller = (req: Request, res: Response, next: NextFunction) => any


const ctrlWrapper = (ctrl: Controller) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ctrl(req, res, next)
    } catch (error) {
      //function overloading
      //automatically next looks for error handler, which for him is function that has four arguments in server
      next(error);
    }
  };
  return func;
};

export default ctrlWrapper;