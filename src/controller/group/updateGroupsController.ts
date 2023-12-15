import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import HttpException from "../../common/http-exception";
import { BaseGroups, GroupModel } from "../../model/groupsModel";
import { ValidationError, validationResult } from "express-validator";
import { UserModel } from "../../model/usersModel";

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

          const groupId = req.params.groupId;
          const { name } = req.body;
          const result = await GroupModel.findByIdAndUpdate(
               { _id: groupId },
               { $set: { name } },
               { new: true }
          );
          res.status(200).json({ result });
     } catch (err) {
          next(err);
     }
};
