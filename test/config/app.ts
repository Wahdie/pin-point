import express from "express";
import cors from "cors";
import connectDB from "./db";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// Router middleware
import { userRouter } from "../../src/routes/userRouter";
import { authRouter } from "../../src/routes/authRouter";
import { groupRouter } from "../../src/routes/groupRouter";
import { attandanceRouter } from "../../src/routes/attandanceRouter";
import { notFoundHandler } from "../../src/middleware/notFound/notFoundHandler";
import { errorHandler } from "../../src/middleware/error/errorHandler";

if (!process.env.PORT_DEV) {
     process.exit(1);
}
const app = express();

connectDB.connection.once("open", () => console.log("Koneksi terhubung..."));

// Dependencies
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Router
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/groups", groupRouter);
app.use("/attandance", attandanceRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export {app}