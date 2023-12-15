import { Express, Request, Response, NextFunction } from "express";
import { BaseGroups } from "../../model/groupsModel";
import { GroupModel } from "../../model/groupsModel";
import HttpException from "../../common/http-exception";
import mongoose from "mongoose";
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
          const groupId = req.params.groupId;
          const group: BaseGroups | null = await GroupModel.findById(groupId);
          if (!group) {
               throw new HttpException({ message: "Group tidak ditemukan", statusCode: 404 });
          }
          res.status(200).json({ group: group });
     } catch (error) {
          next(error);
     }
};
