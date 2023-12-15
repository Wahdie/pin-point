import { body, param } from "express-validator";
import HttpException from "../../common/http-exception";
import { ObjectId } from "mongodb";

export const invitationValidator = [
     body("receiverEmail").isEmail().withMessage("Email tidak valid"),
     body("receiverEmail").notEmpty().withMessage("Email penerima tidak boleh kosong")
];
