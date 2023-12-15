import { ExpressValidator, validationResult, body, check, param } from "express-validator";
import { UserModel } from "../../model/usersModel";

export const registerValidator = [
     body("username").notEmpty(),
     body("email").notEmpty().isEmail().withMessage("Email is required"),
     body("email").custom(async (value) => {
          const duplikat: Object | null = await UserModel.findOne({ email: value });
          if (duplikat) throw new Error("Email sudah digunakan!");
          return true;
     }),
     body("username").custom(async (value) => {
          const duplikat: Object | null = await UserModel.findOne({ username: value });
          if (duplikat) throw new Error("Username sudah digunakan!");
          return true;
     }),
     body("password")
          .notEmpty()
          .isLength({ min: 8 })
          .withMessage("Password minimal mengandung 8 karakter"),
     body("role").notEmpty().withMessage("Role user tidak boleh kosong"),
];
