import express, { Response, Request, NextFunction } from "express";
import {
     ExpressValidator,
     validationResult,
     body,
     check,
     param,
     ValidationError,
} from "express-validator";
import HttpException from "../../common/http-exception";
import { UserModel, BaseUser } from "../../model/usersModel";
import bcrypt from "bcrypt";

export default async (req: Request, res: Response, next: NextFunction) => {
     try {
          const newUser: BaseUser = req.body;
          const errors: any = validationResult(req);
          if (!errors.isEmpty()) {
               const errorMessage: string[] = errors.array().map((err: ValidationError) => err.msg);
               throw new HttpException({
                    error: "Registration Failed",
                    message: errorMessage,
                    statusCode: 400,
               });
          }
          const hashedPassword = await bcrypt.hash(newUser.password, 10);
          newUser.password = hashedPassword;
          await UserModel.create(newUser);
          const user = { username: newUser.username, email: newUser.email, role: newUser.role };
          res.status(200).json({
               message: "Success",
               newUser: user,
               status: 200,
          });
     } catch (err: any) {
          next(err);
     }
};
