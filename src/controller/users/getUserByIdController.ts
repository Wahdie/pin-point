import { Response, Request, NextFunction } from "express";
import { BaseUser, UserModel } from "../../model/usersModel";
import HttpException from "../../common/http-exception";
import { ValidationError, validationResult } from "express-validator";

export default async (req: Request, res: Response, next: NextFunction) => {
     try {
          const errors: any = validationResult(req);
          if (!errors.isEmpty()) {
               const errorMessage: string[] = errors.array().map((err: ValidationError) => err.msg);
               throw new HttpException({
                    message: errorMessage,
                    statusCode: 400,
               });
          }
          const id = req.params.id;
          const user = await UserModel.findById(id).select('username email id');
          if (!user) {
               throw new HttpException({ message: "No user found", statusCode: 404 });
          }
          res.status(200).json(user);
     } catch (error) {
          next(error);
     }
};
