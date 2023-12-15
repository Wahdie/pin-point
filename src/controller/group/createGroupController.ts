import express, { Response, Request, NextFunction } from "express";
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
          const id = req.body.user.userId;
          const groupName = req.body.name;
          const admin = await UserModel.findById(id);
          if (!admin || !admin.role || admin.role !== "admin") {
               throw new HttpException({ message: `User dengan id ${id} bukan admin` });
          }
          const newItem = { name: groupName, admin: id, member: [id] };
          const newGroup = await GroupModel.create(newItem);
          res.status(201).json({
               msg: "success",
               newGroup: newGroup,
          });
     } catch (error) {
          next(error);
     }
};
