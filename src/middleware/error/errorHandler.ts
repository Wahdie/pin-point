import HttpException from "../../common/http-exception";
import { Request, Response, NextFunction } from "express";
// import  express  from "express";

// const app = express();
export const errorHandler = (
     error: HttpException,
     request: Request,
     response: Response,
     next: NextFunction
) => {
     const status = error.statusCode || error.status || 503;
     const message = error.message || "Terjadi kesalahan";
     const errorMessage = error.error || "Internal Server Error";
     response.status(status).json({ message, errorMessage });
};
