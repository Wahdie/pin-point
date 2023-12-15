import { Response, Request, NextFunction } from "express";
import { AttandanceModel, BaseAttendace } from "../../model/attendanceModel";
import { ValidationError, validationResult } from "express-validator";
import HttpException from "../../common/http-exception";
import { GroupModel } from "../../model/groupsModel";

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

          const { photo, location, tagLocation } = req.body;
          
          const userId = req.body.user.userId;
          const userGroup = await GroupModel.findOne({ member: userId });

          if (!userGroup) {
               throw new HttpException({
                    message: "User not found in any group",
                    statusCode: 404,
               });
          }
          const newAttandance: BaseAttendace = {
               user: userId,
               group: userGroup.name,
               photo,
               location,
               tagLocation,
               date: new Date(),
          };

          const result = await AttandanceModel.create(newAttandance);
          res.status(200).json(result);
     } catch (error) {
          next(error);
     }
};
