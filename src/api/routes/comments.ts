import Router, { Application } from "express";
import { BlogService } from "../../services/blogs";
import { BlogController } from "../controllers/blogs";
import { auth } from "../middleware/authUser";
import { isAdmin } from "../middleware/isAdminUser";
import { CommentController } from "../controllers/comments";
import { CommentService } from "../../services/comment";

const commentsRouter = Router();

export const UserApi = (app: Application, CS: CommentService) => {
  const CC = new CommentController(CS);

  app.get("get-all/:blogId", CC.getBlogComments);
  app.post("/add/:blogId", auth, CC.addComment);
  app.delete("/delete/:id", auth, CC.deleteComment);
  app.use("/comments", commentsRouter);
};

export default commentsRouter;
