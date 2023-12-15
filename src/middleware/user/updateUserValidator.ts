import { body, param } from "express-validator";
import { BaseUser, UserModel } from "../../model/usersModel";
import HttpException from "../../common/http-exception";
import { ObjectId } from "mongodb";

export const updateValidator = [
     param("id").custom(async (value, { req }) => {
          const id = value;
          if (!id) {
               throw new HttpException({ message: "Id tidak ada", statusCode: 400 });
          }
          if (!ObjectId.isValid(id)) {
               throw new HttpException({ message: "Invalid ID", statusCode: 404 });
          }
     }),
     body("username").notEmpty(),
     body("email").notEmpty().isEmail().withMessage("Email is required"),
     body("email").custom(async (value, { req }) => {
          const id = req.params?.id;
          const duplikat: Object | null = await UserModel.findOne({ email: value });
          const oldData: BaseUser | null = await UserModel.findById(id);

          if (!oldData) {
               throw new HttpException({ statusCode: 400, message: "User tidak tersedia" });
          }
          const oldEmail = oldData.email;

          if (duplikat && value !== oldEmail) throw new Error("Email sudah digunakan!");
          return true;
     }),
     body("password")
          .notEmpty()
          .isLength({ min: 8 })
          .withMessage("Password minimal mengandung 8 karakter"),
     body("role").notEmpty().withMessage("Role user tidak boleh kosong"),
];
