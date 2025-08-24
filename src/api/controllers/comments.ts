import { Request, Response } from "express";
import { CommentService } from "../../services/comment";

class CommentController {
  commentService: CommentService;
  constructor(commentService: CommentService) {
    this.commentService = commentService;
    this.getBlogComments = this.getBlogComments.bind(this);
    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }
  async getBlogComments(req: Request, res: Response) {
    const { blogId } = req.params;
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }
    const data = await this.commentService.blogsComment(blogId);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }
  async addComment(req: Request, res: Response) {
    const { blogId, desc } = req.body;
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }
    const { userId } = req.user;
    const data = await this.commentService.addComment(blogId, userId, desc);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }
  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Comment ID is required" });
    }
    const { userId, role } = req.user;
    const data = await this.commentService.deleteComment(id, userId, role);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }
}
export { CommentController };
