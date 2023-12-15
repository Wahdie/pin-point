import { Express, Request, Response, NextFunction } from "express";
import { BaseGroups } from "../../model/groupsModel";
import { GroupModel } from "../../model/groupsModel";
import HttpException from "../../common/http-exception";

export default async (req: Request, res: Response, next: NextFunction) => {
     try {
          const groups: BaseGroups[] = await GroupModel.find();
          if (groups.length === 0) {
               throw new HttpException({ message: "No groups found", statusCode: 404 });
          }
          res.status(200).json({ groups: groups });
     } catch (error) {
          next(error);
     }
};
