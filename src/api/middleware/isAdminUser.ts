import jwt from "jsonwebtoken";
import { Response, NextFunction, Request } from "express";
import { JWT_TOKEN } from "../../config/config";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req?.cookies?.accessUserToken;

  if (!token) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "You're not logged in. Please log in to continue.",
      data: null,
      error: "Authentication required",
    });
  }

  jwt.verify(token, JWT_TOKEN, (err: any, data: any) => {
    if (err) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Session expired. Please log in again.",
        data: null,
        error: "Authentication failed",
      });
    }

    req.user = data;
    const userRole = req.user.role;

    if (userRole === "admin") {
      return next();
    } else {
      return res.status(403).json({
        code: 403,
        status: "error",
        message: "You don't have permission to access this resource.",
        data: null,
        error: "Forbidden",
      });
    }
  });
};

export { isAdmin };
