import { NextFunction, Response, Request } from "express";
import { UserModel } from "../../model/usersModel";
import {
     ExpressValidator,
     ValidationError,
     body,
     check,
     validationResult,
} from "express-validator";
import HttpException from "../../common/http-exception";
import { updateValidator } from "../../middleware/user/updateUserValidator";
import bcrypt from "bcrypt";

export const passwordValidator = updateValidator[4];
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
          const id = req.body.user.userId;
          const paramsId = req.params.id;
          if (id !== paramsId) {
               throw new HttpException({
                    message: "Tidak dapat mengubah password user lain",
                    statusCode: 403,
               });
          }
          const passwordUpdate: string = req.body.password;
          const existingUser = await UserModel.findById(id);
          if (!existingUser)
               throw new HttpException({ statusCode: 400, message: "User tidak ditemukan" });
          const passwordHasehd = await bcrypt.hash(passwordUpdate, 10);
          existingUser.password = passwordHasehd;
          await UserModel.updateOne(
               {
                    _id: id,
               },
               {
                    username: existingUser.username,
                    email: existingUser.email,
                    password: passwordHasehd,
               }
          );
          return res.status(200).json({
               message: "success",
          });
     } catch (e) {
          next(e);
     }
};
