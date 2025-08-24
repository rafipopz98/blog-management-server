import Router, { Application } from "express";
import { userController } from "../controllers/user";
import { UserService } from "../../services/user";
import { auth } from "../middleware/authUser";

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
  app.post("/reset-password", auth, UC.resetPassword);
  app.post("/logout", UC.Logout);

  app.get("/profile", auth, UC.getUserProfile);
  app.post("/update/profile", auth, UC.updateProfile);
};

export default userRouter;
