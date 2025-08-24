import Router, { Application } from "express";
export const router = Router();
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

  userRouter.post("/login", UC.userLogin);
  userRouter.post("/register", UC.userRegister);
  userRouter.post("/reset-password", auth, UC.resetPassword);
  userRouter.post("/logout", UC.Logout);

  userRouter.get("/profile", auth, UC.getUserProfile);
  userRouter.post("/update/profile", auth, UC.updateProfile);

  app.use("/user", userRouter);
};

export default userRouter;
