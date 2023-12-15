import express from "express";
import updatePassword, { passwordValidator } from "../controller/users/updatePassword";
import { notFoundHandler } from "../middleware/notFound/notFoundHandler";
import { errorHandler } from "../middleware/error/errorHandler";
import { authenticateUser, autorizeUser } from "../middleware/auth/authMiddleware";
import deleteUserController from "../controller/users/deleteUserController";
import getAllUserController from "../controller/users/getAllUserController";
import { idValidator } from "../middleware/group/groupValidator";
import getUserByIdController from "../controller/users/getUserByIdController";

export const userRouter = express.Router();

userRouter.use(authenticateUser);
userRouter.put("/update-password/:id", idValidator[0], passwordValidator, updatePassword);
userRouter.use(autorizeUser);
userRouter.get("/", getAllUserController);
userRouter.get("/:id", idValidator[0], getUserByIdController);
userRouter.delete("/:id", idValidator[0], deleteUserController);
userRouter.use(notFoundHandler);
userRouter.use(errorHandler);
