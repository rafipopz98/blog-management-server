import { Request, Response } from "express";
import { UserService } from "../../services/user";
import {
  resetPasswordValidation,
  userLoginValidation,
  userRegisterValidation,
} from "../validations/user";

class userController {
  userService: UserService;

  constructor(US: UserService) {
    this.userService = US;
  }

  public async userRegister(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const { error } = userRegisterValidation.validate({
      username,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const data: any = await this.userService.register({
      username,
      email,
      password,
    });
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    res.cookie("accessUserToken", data.data?.finalData.token, {
      httpOnly: true,
    });
    return res.status(statusCode).json(data);
  }

  public async userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const { error } = userLoginValidation.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const data: any = await this.userService.login({ email, password });
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    res.cookie("accessUserToken", data.data?.finalData.token, {
      httpOnly: true,
    });
    return res.status(statusCode).json(data);
  }
  public async resetPassword(req: Request, res: Response) {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    const { error } = resetPasswordValidation.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const data = await this.userService.resetPassword({
      oldPassword,
      newPassword,
      userId,
    });
  }
  public async Logout(req: Request, res: Response) {
    res
      .clearCookie("accessUserToken", {
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json("User has been logged out successfully");
  }
}
export { userController };
