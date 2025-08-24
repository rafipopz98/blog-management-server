import { Request, Response, NextFunction } from "express";
import { JWT_TOKEN } from "../../config/config";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessUserToken;
  if (!token)
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "You're not logged in. Please log in to continue.",
      data: null,
      error: "Authentication required",
    });

  jwt.verify(token, JWT_TOKEN, async (err: any, data: any) => {
    if (err)
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "You're not logged in. Please log in to continue.",
        data: null,
        error: "Authentication required",
      });
    req.user = data;
    return next();
  });
};
