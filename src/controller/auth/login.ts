import { BaseUser, UserModel } from "../../model/usersModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import HttpException from "../../common/http-exception";

const login = async (req: Request, res: Response, next: NextFunction) => {
     try {
          if ((!req.body.username && !req.body.email) || !req.body.password)
               throw new HttpException({
                    statusCode: 400,
                    message: "username or email and password are required",
               });

          let user;
          if (req.body.email) {
               user = await UserModel.findOne({ email: req.body.email });
          }

          user = await UserModel.findOne({ username: req.body.username });

          if (!user)
               throw new HttpException({
                    statusCode: 400,
                    message: "Invalid username",
                    error: "Masukkan Username atau Email yang sesuai",
               });
          const validPassword = await bcrypt.compare(req.body.password, user.password);
          if (!validPassword)
               throw new HttpException({
                    statusCode: 400,
                    message: "Invalid password",
                    error: "Masukkan password yang sesuai",
               });
          const token = jwt.sign({ userId: user._id, role: user.role }, "jwt", {
               expiresIn: "24h",
          });
          res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
          res.header("Authorization", `Bearer ${token}`).json({
               msg: "Login Successfully",
               token: token,
          });
     } catch (err) {
          next(err);
     }
};

export default login;
