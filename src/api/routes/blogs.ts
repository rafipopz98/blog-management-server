import Router, { Application } from "express";
import { userController } from "../controllers/user";
import { UserService } from "../../services/user";
import { BlogService } from "../../services/blogs";
import { BlogController } from "../controllers/blogs";
import { auth } from "../middleware/authUser";
import { isAdmin } from "../middleware/isAdminUser";

const blogRouter = Router();

export const UserApi = (app: Application, BS: BlogService) => {
  const BC = new BlogController(BS);

  app.get("/get-all", BC.getAllBlogs);
  app.get("/get/:id", BC.getBlog);
  app.post("/create", auth, BC.CreateBlog);
  app.delete("/delete/:id", auth, BC.deleteBlog);
  app.patch("/feature", isAdmin, BC.featureBlog);

  app.use("/blogs", blogRouter);
};

export default blogRouter;
