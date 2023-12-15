import { Request, Response, NextFunction } from "express";
import HttpException from "../../common/http-exception";

export const notFoundHandler = (request: Request, response: Response, next: NextFunction) => {
     try {
          throw new HttpException({ statusCode: 404, message: "Resource Not Found" });
     } catch (err) {
          next(err);
     }
};
