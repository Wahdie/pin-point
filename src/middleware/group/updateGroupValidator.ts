import { body, param } from "express-validator";
import { GroupModel } from "../../model/groupsModel";
import HttpException from "../../common/http-exception";
import { UserModel } from "../../model/usersModel";
import { ObjectId } from "mongodb";

export const updateGroupValidator = [
     body("name").custom(async (value, { req }) => {
          const group = await GroupModel.findOne({ name: value });
          const id = group?.id;
          const idCurrentGroup = req.params?.groupId;
          if (group && id !== idCurrentGroup) {
               throw new HttpException({ message: "Nama sudah digunakan", statusCode: 400 });
          }
     }),
     body("name").notEmpty().withMessage("Nama group tidak boleh kosong"),
     body("user").custom(async (value, { req }) => {
          const id = req.body.user.userId;
          const admin = await UserModel.findById(id);
          if (!admin || admin.role !== "admin") {
               throw new HttpException({
                    message: "Admin group harus admin user",
                    statusCode: 400,
               });
          }
     }),
];
