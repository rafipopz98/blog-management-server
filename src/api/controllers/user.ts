import { Request, Response } from "express";
import { UserService } from "../../services/user";
import {
  isUserName,
  resetPasswordValidation,
  userLoginValidation,
  userRegisterValidation,
} from "../validations/user";

class userController {
  userService: UserService;

  constructor(US: UserService) {
    this.userService = US;
    this.userRegister = this.userRegister.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.Logout = this.Logout.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
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
    console.log(data);
    // res.cookie("accessUserToken", data.data?.token, {
    //   httpOnly: true,
    // });
    res.cookie("accessUserToken", data.data?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict", // prevent CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 day
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
    // res.cookie("accessUserToken", data.data?.token, {
    //   httpOnly: true,
    // });
    res.cookie("accessUserToken", data.data?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict", // prevent CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 day
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

  public async getUserProfile(req: Request, res: Response) {
    const { userId } = req.user;
    const data = await this.userService.getUserProfile(userId);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }

  public async updateProfile(req: Request, res: Response) {
    const { username } = req.body;
    const { error } = isUserName.validate({ username });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { userId } = req.user;
    const data = await this.userService.updateProfile({ userId, username });
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }
}
export { userController };
