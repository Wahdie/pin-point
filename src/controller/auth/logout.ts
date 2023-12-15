import { Request, Response } from "express";

export function logout(req: Request, res: Response) {
     res.cookie("token", "", {
          expires: new Date(Date.now() + 5 * 100 * 1000),
          httpOnly: true,
     });
     res.header("Authorization", "");
     res.status(200).json({ status: "success" });
}
