import express from "express";
import cors from "cors";
import connectDB from "./db";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// Router middleware
import { userRouter } from "./routes/userRouter";
import { authRouter } from "./routes/authRouter";
import { groupRouter } from "./routes/groupRouter";
import { notFoundHandler } from "./middleware/notFound/notFoundHandler";
import { errorHandler } from "./middleware/error/errorHandler";
import { attandanceRouter } from "./routes/attandanceRouter";


if (!process.env.PORT_APP) {
     process.exit(1);
}
const PORT_APP = parseInt(process.env.PORT_APP);

const app = express();
app.listen(PORT_APP, () => {
     console.log(`listening on http://localhost:${PORT_APP}`);
});
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
