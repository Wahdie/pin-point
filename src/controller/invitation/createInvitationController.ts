import { Response, Request, NextFunction } from "express";
import { BaseInvitation, InvitationModel } from "../../model/invitationsModel";
import { UserModel } from "../../model/usersModel";
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

          const adminId = req.body.user.userId;
          const groupId = req.params.groupId;
          const { receiverEmail } = req.body;

          const sender = await UserModel.findById(adminId);
          if (!sender || sender.role !== "admin") {
               throw new HttpException({
                    message: "Anda bukan admin, silakan login sebagai admin",
                    statusCode: 400,
               });
          }
          const group = await GroupModel.findById(groupId);
          if (!group) {
               throw new HttpException({ message: "Group not found", statusCode: 404 });
          }

          const newInvitation: BaseInvitation = {
               senderId: sender.id,
               receiverEmail,
               groupId,
               status: "pending",
               isUpdate: false,
          };

          const createdInvitation = await InvitationModel.create(newInvitation);
          res.status(201).json(createdInvitation);
     } catch (err) {
          next(err);
     }
};
