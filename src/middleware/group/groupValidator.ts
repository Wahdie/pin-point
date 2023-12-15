import { body, param } from "express-validator";
import { GroupModel } from "../../model/groupsModel";
import { ObjectId } from "mongodb";
import HttpException from "../../common/http-exception";

export const groupsValidator = [
     body("name").custom(async (value) => {
          const duplikat: Object | null = await GroupModel.findOne({ name: value });
          if (duplikat) throw new Error("Nama group sudah digunakan!");
          return true;
     }),
     body("name").notEmpty().withMessage("Nama group tidak boleh kosong"),
];

export const idValidator = [
     param("id").custom(async (value, { req }) => {
          const id = value;
          if (!id) {
               throw new HttpException({
                    message: "Id user tidak ada. Masukkan Id user",
                    statusCode: 400,
               });
          }
          if (!ObjectId.isValid(id)) {
               throw new HttpException({ message: "Invalid ID user", statusCode: 404 });
          }
     }),
     param("groupId").custom(async (value, { req }) => {
          const id = value;
          if (!id) {
               throw new HttpException({
                    message: "Id group tidak ada. Masukkan Id group",
                    statusCode: 400,
               });
          }
          if (!ObjectId.isValid(id)) {
               throw new HttpException({ message: "Invalid ID Group", statusCode: 404 });
          }
     }),
     param("invitationId").custom(async (value, { req }) => {
          const id = value;
          if (!id) {
               throw new HttpException({
                    message: "Id invitation tidak ada. Masukkan Id invitation",
                    statusCode: 400,
               });
          }
          if (!ObjectId.isValid(id)) {
               throw new HttpException({ message: "Invalid ID Invitation", statusCode: 404 });
          }
     }),
];
