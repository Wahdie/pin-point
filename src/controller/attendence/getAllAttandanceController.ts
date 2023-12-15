import { Response, Request, NextFunction } from "express";
import { AttandanceModel, BaseAttendace } from "../../model/attendanceModel";
import { ValidationError, validationResult } from "express-validator";
import HttpException from "../../common/http-exception";
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

          const usersFilterString = req.query.usersFilter as string;
          const usersFilter = usersFilterString ? usersFilterString.split(",") : [];

          const startDate = req.query.startDate
               ? new Date(req.query.startDate as string)
               : new Date(0);
          const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

          
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
               throw new HttpException({ message: "Invalid Date", statusCode: 400 });
          }

          // filter berdasar user
          const userIds = await UserModel.find({ username: { $in: usersFilter } }).distinct("_id");
          if (!userIds || userIds.length === 0) {
               return res.status(200).json([]);
          }
          const attandance = await AttandanceModel.find({ user: { $in: userIds } });
          if (!attandance) {
               throw new HttpException({ message: "Attandance not found", statusCode: 404 });
          }

          // filter berdasatkan tanggal
          const filteredAttendance = attandance.filter((attandance) => {
               const attandanceDate = new Date(attandance.date);
               return attandanceDate >= startDate && attandanceDate <= endDate;
          });

          res.status(200).json(filteredAttendance);
     } catch (error) {
          next(error);
     }
};
