import { Response, Request, NextFunction } from "express";
import { BaseUser, UserModel } from "../../model/usersModel";
import HttpException from "../../common/http-exception";

export default async (req: Request, res: Response, next: NextFunction) => {
     try {
          const users = await UserModel.find().select('username email id');
          if (users.length === 0 || !users) {
               throw new HttpException({ message: "No users found", statusCode: 404 });
          }
          res.status(200).json(users);
     } catch (error) {
          next(error);
     }
};
