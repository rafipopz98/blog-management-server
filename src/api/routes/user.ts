import Router, { Application } from "express";
import { userController } from "../controllers/user";
import { UserService } from "../../services/user";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const userRouter = Router();

export const UserApi = (app: Application, US: UserService) => {
  const UC = new userController(US);

  app.post("/login", UC.userLogin);
  app.post("/register", UC.userRegister);
  app.post("/reset-password", UC.resetPassword);
  app.post("/logout", UC.Logout);
};

export default userRouter;
