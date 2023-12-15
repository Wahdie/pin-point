// Error Handling using http-
import { Request, Response, NextFunction } from "express";
import express from "express";
const app = express();

export default class HttpException extends Error {
     statusCode?: number;
     status?: number;
     message: string;
     error?: string | null;

     constructor({
          error,
          message,
          statusCode,
     }: // req,
     // res
     {
          error? : string ; 
          message?: any;
          statusCode?: number;
          // req : Request;
          // res : Response;
     }) {
          super(message);

          this.statusCode = statusCode || 503;
          this.message = message || "";
          this.error = error || "Internal Server Error";
          // res.status(this.statusCode).json({message, error })
     }
}
