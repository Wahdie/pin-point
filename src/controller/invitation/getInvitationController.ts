import { Response, Request, NextFunction } from "express";
import { InvitationModel } from "../../model/invitationsModel";
import { UserModel } from "../../model/usersModel";
import { ValidationError, validationResult } from "express-validator";
import HttpException from "../../common/http-exception";

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
          const user = await UserModel.findById(id);

          if (!user) {
               throw new HttpException({ message: "User not found", statusCode: 404 });
          }

          const invitation = await InvitationModel.find({ receiverEmail: user.email });
          if (!invitation) {
               throw new HttpException({ message: "Invitation not found", statusCode: 404 });
          }
          res.status(200).json(invitation);
     } catch (err) {
          next(err);
     }
};
