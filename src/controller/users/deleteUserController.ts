import { Response, Request, NextFunction } from "express";
import HttpException from "../../common/http-exception";
import { ValidationError, validationResult } from "express-validator";
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
          const adminId = req.body.user.userId;
          const user = await UserModel.findById(userId);
          if (!user) {
               throw new HttpException({ message: "User not found", statusCode: 404 });
          }

          const admin = await UserModel.findById(adminId);
          if (!admin) {
               throw new HttpException({ message: "Anda bukan admin", statusCode: 404 });
          }

          const userGroups = await GroupModel.find({ member: userId });
          if (!userGroups || userGroups.length === 0) {
               await UserModel.findByIdAndDelete(userId);
               return res.status(200).json({ message: "User deleted successfully" });
          }
          await Promise.all(
               userGroups.map(async (group) => {
                    await GroupModel.findByIdAndUpdate(
                         group._id,
                         { $pull: { member: userId } },
                         { new: true }
                    );
               })
          );
          console.log(userGroups);
          await UserModel.findByIdAndDelete(userId);
          res.status(200).json({
               message: "User deleted and removed from all groups successfully",
          });
     } catch (error) {
          next(error);
     }
};
