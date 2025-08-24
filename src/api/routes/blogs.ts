import Router, { Application } from "express";
import { userController } from "../controllers/user";
import { UserService } from "../../services/user";
import { BlogService } from "../../services/blogs";
import { BlogController } from "../controllers/blogs";
import { auth } from "../middleware/authUser";
import { isAdmin } from "../middleware/isAdminUser";

const blogRouter = Router();

export const BlogApi = (app: Application, BS: BlogService) => {
  const BC = new BlogController(BS);

  blogRouter.get("/get-all", BC.getAllBlogs);
  blogRouter.get("/get-featured", BC.getFeaturedPost);
  blogRouter.get("/get/:id", BC.getBlog);
  blogRouter.post("/create", auth, BC.CreateBlog);
  blogRouter.patch("/update", auth, BC.UpdateBlog);
  blogRouter.delete("/delete/:id", auth, BC.deleteBlog);
  blogRouter.patch("/feature", isAdmin, BC.featureBlog);
  blogRouter.get("/get-profile", auth, BC.getUserProfile);
  blogRouter.get("/get-user-blogs", auth, BC.getUserBlogs);

  app.use("/blogs", blogRouter);
};

export default blogRouter;
