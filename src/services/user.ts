import { JWT_SECRET } from "../config/config";
import { User } from "../db/model/user";
import { comparePassword, hashPassword } from "../lib/utils";

class UserService {
  async register({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    try {
      const existingUser = await User.findOne({
        email: email,
      });
      if (existingUser) {
        return { success: false, data: null, error: "User already exists" };
      }

      const hashedPassword = hashPassword({ password });

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      const tokenData = this.CreateAuthIDs({
        userId: savedUser._id.toString(),
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        expires: "7d",
      });

      const finalData = {
        id: savedUser._id,
        username,
        email,
        role: savedUser.role,
        token: (await tokenData).data,
      };

      return { success: true, data: finalData, error: null };
    } catch (error) {
      console.error("Error in register:", error);
      return { success: false, data: null, error };
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, data: null, error: "User not found" };
      }

      const isPasswordValid = comparePassword({
        password,
        hashedPassword: user.password,
      });

      if (!isPasswordValid) {
        return { success: false, data: null, error: "Invalid password" };
      }
      const tokenData = await this.CreateAuthIDs({
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        expires: "7d",
      });

      const token = tokenData.data;

      const finalData = {
        id: user._id,
        username: user.username,
        email,
        role: user.role,
        token: token,
      };

      console.log(token, "token");
      console.log("JWT_SECRET in prod:", JWT_SECRET);

      return { success: true, data: finalData, error: null };
    } catch (error) {
      console.error("Error in login:", error);
      return { success: false, data: null, error };
    }
  }

  async resetPassword({
    oldPassword,
    newPassword,
    userId,
  }: {
    oldPassword: string;
    newPassword: string;
    userId: string;
  }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, data: null, error: "User not found" };
      }
      const compareOldPassword = comparePassword({
        password: oldPassword,
        hashedPassword: user.password,
      });
      if (!compareOldPassword) {
        return {
          success: false,
          data: "Old password is incorrect",
          error: "Old password is incorrect",
        };
      }
      const newHashedPassword = hashPassword({ password: newPassword });
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          password: newHashedPassword,
        }
      );
      return { success: true, data: null, error: null };
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return { success: false, data: null, error };
    }
  }

  async updateProfile({
    userId,
    username,
  }: {
    userId: string;
    username: string;
  }) {
    try {
      const existingUsername = await User.findById(username);
      if (existingUsername) {
        return { success: false, data: null, error: "Username already exists" };
      }

      const user = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          username,
        }
      );

      if (!user) {
        return { success: true, data: null, error: "No User Found" };
      }
      const finalData = {
        username: user.username,
        email: user.email,
        img_id: user.img_id,
        role: user.role,
        id: user._id,
      };
      return { success: true, data: finalData, error: null };
    } catch (error) {
      console.log("Error while updating user profile", error);
      return { success: false, data: null, error };
    }
  }

  async getUserProfile(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: true, data: null, error: null };
      }
      const finalData = {
        username: user.username,
        email: user.email,
        img_id: user.img_id,
        role: user.role,
        id: user._id,
      };
      return { success: true, data: finalData, error: null };
    } catch (error) {
      console.log("Error while fetching user profile", error);
      return { success: false, data: null, error };
    }
  }

  async CreateAuthIDs({
    userId,
    username,
    email,
    role,
    expires,
  }: {
    userId: string;
    username: string;
    email: string;
    role: string;
    expires: string;
  }) {
    try {
      const { SignJWT } = await import("jose");
      const token = await new SignJWT({ userId, username, email, role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expires)
        .sign(JWT_SECRET);
      return { success: true, data: token, error: null };
    } catch (error) {
      console.error("Error in CreateAuthIDs:", error);
      return { success: false, data: null, error };
    }
  }
}
export { UserService };
