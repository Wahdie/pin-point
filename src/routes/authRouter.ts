import express from "express";
import register from "../controller/auth/register";
import login from "../controller/auth/login";
import { registerValidator } from "../middleware/user/registerUsersvalidator";
import { logout } from "../controller/auth/logout";
import { notFoundHandler } from "../middleware/notFound/notFoundHandler";
import { errorHandler } from "../middleware/error/errorHandler";

export const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.use(notFoundHandler);
authRouter.use(errorHandler);
