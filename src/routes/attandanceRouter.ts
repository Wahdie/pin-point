import createAttandanceController from "../controller/attendence/createAttandanceController";
import express from "express";
import { attandanceValidtaor } from "../middleware/attandance/createAttendanceValidator";
import { autorizeUser, authenticateUser } from "../middleware/auth/authMiddleware";
import { notFoundHandler } from "../middleware/notFound/notFoundHandler";
import { errorHandler } from "../middleware/error/errorHandler";
import getAttandanceUserController from "../controller/attendence/getAttandanceUserController";
import getAllAttandanceController from "../controller/attendence/getAllAttandanceController";

export const attandanceRouter = express.Router();

attandanceRouter.use(authenticateUser);
attandanceRouter.get("/getMe", getAttandanceUserController);
attandanceRouter.post("/", attandanceValidtaor, createAttandanceController);
attandanceRouter.use(autorizeUser);
attandanceRouter.get("/", getAllAttandanceController);
attandanceRouter.use(notFoundHandler);
attandanceRouter.use(errorHandler);
