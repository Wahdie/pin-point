import { Response, Request, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import HttpException from "../../common/http-exception";
import { UserModel } from "../../model/usersModel";
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
          const userId = req.params.id;
          const groupId = req.params.groupId;
          const idAdmin = req.body.user.userId;

          const user = await UserModel.findById(userId);
          if (!user) {
               throw new HttpException({ message: "User not found", statusCode: 404 });
          }
          const admin = await UserModel.findById(idAdmin);
          if (admin?.role !== "admin") {
               throw new HttpException({ message: "Anda bukan admin", statusCode: 400 });
          }
          const userGroup = await GroupModel.findById(groupId);
          if (!userGroup) {
               throw new HttpException({ message: "Group not found", statusCode: 404 });
          }
          const isMember = userGroup.member.includes(userId);
          if (!isMember) {
               throw new HttpException({
                    message: "User bukan member dari group",
                    statusCode: 404,
               });
          }
          userGroup.member = userGroup.member.filter((memberId) => memberId.toString() !== userId);
          await userGroup.save();

          res.status(200).json({ msg: "User successfully removed from group", statusCode: 404 });
     } catch (error) {
          next(error);
     }
};
