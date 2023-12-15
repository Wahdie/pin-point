import  { Response, Request, NextFunction } from "express";
import {  GroupModel } from "../../model/groupsModel";
import { ObjectId } from "mongodb";
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
          const id = req.params.groupId;
          if (!id) {
               throw new HttpException({ message: "Id tidak ada", statusCode: 400 });
          }
          if (!ObjectId.isValid(id)) {
               throw new HttpException({ message: "Invalid ID", statusCode: 404 });
          }
          const group = await GroupModel.findById(id);
          if (!group) {
               throw new HttpException({ message: "Group not found", statusCode: 404 });
          }
          const result = await GroupModel.findByIdAndDelete(id);
          res.status(200).json({ msg: "Group deleted succesfully", result });
     } catch (err) {
          next(err);
     }
};
