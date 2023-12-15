import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpException from "../../common/http-exception";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
          // const token = req.header("Authorization");
          const token = req.cookies.token;
          if (!token)
               throw new HttpException({
                    statusCode: 401,
                    message: "Anda belum login. Silakan Login terlebih dahulu",
               });

          jwt.verify(token, "jwt", (err: any, user: any) => {
               if (err) throw new HttpException({ statusCode: 403, message: "invalid token" });
               req.body.user = user;
               const jsonString = JSON.stringify(req.body.user);
               // console.log("user: " + jsonString);
          });
          next();
     } catch (err) {
          next(err);
     }
};

export const autorizeUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
          if (!req.body.user || req.body.user.role !== "admin") {
               throw new HttpException({
                    statusCode: 403,
                    message: "Akses  ditolak. Anda bukan admin",
               });
          }
          next();
     } catch (err) {
          next(err);
     }
};
