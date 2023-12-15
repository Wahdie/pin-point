import { Response, Request, NextFunction } from "express";
import { UserModel } from "../../model/usersModel";
import { GroupModel } from "../../model/groupsModel";
import { ValidationError, validationResult } from "express-validator";
import HttpException from "../../common/http-exception";
import { InvitationModel } from "../../model/invitationsModel";

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
          const invitationId = req.params.invitationId;
          const userId = req.body.user.userId;
          const invitation = await InvitationModel.findById(invitationId);
          if (!invitation) {
               throw new HttpException({ message: "Invitation not found", statusCode: 404 });
          }
          const user = await UserModel.findById(userId);
          if (!user) {
               throw new HttpException({ message: "User not found", statusCode: 404 });
          }
          if (user.email !== invitation.receiverEmail) {
               throw new HttpException({
                    message: "Tidak bisa merubah undangan user lain",
                    statusCode: 401,
               });
          }
          const group = await GroupModel.findById(invitation.groupId);
          // cek user di current group
          if (!group) {
               throw new HttpException({ message: "Group not found", statusCode: 404 });
          }

          // cek user apakah sudah join group lain
          const userGroup = await GroupModel.findOne({ member: user.id });
          if (userGroup) {
               throw new HttpException({
                    message: "User hanya boleh mengikuti satu group",
                    statusCode: 404,
               });
          }

          //     await GroupModel.updateOne(
          //          { id: invitation.groupId },
          //          { $push: { members: user.id } },
          //          { new: true }
          //     );
          if (
               invitation.status === "accepted" ||
               invitation.status === "rejected" ||
               invitation.isUpdate == true
          ) {
               throw new HttpException({
                    message: "Invitation is expired",
                    statusCode: 400,
               });
          }
          if (group.member.includes(user.id)) {
               throw new HttpException({ message: "Already in group", statusCode: 400 });
          }
          if (req.route.path.includes("accept")) {
               group.member.push(user.id);
               await group.save();

               const updateInvitation = await InvitationModel.findByIdAndUpdate(
                    { _id: invitation.id },
                    { isUpdate: true, status: "accepted" },
                    { new: true }
               );
               return res.status(200).json({
                    msg: "Invitation accepted successfully",
                    result: updateInvitation,
               });
          }
          const updateInvitation = await InvitationModel.findByIdAndUpdate(
               { _id: invitation.id },
               { isUpdate: true, status: "rejected" },
               { new: true }
          );
          res.status(200).json({
               msg: "Invitation rejected successfully",
               result: updateInvitation,
          });
     } catch (error) {
          next(error);
     }
};
