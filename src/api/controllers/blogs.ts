import { Request, Response } from "express";
import { BlogService } from "../../services/blogs";
import { getAllBlogsValidations } from "../validations/blogs";

class BlogController {
  blogService: BlogService;

  constructor(blogService: BlogService) {
    this.blogService = blogService;
    this.getAllBlogs = this.getAllBlogs.bind(this);
    this.getBlog = this.getBlog.bind(this);
    this.CreateBlog = this.CreateBlog.bind(this);
    this.deleteBlog = this.deleteBlog.bind(this);
    this.featureBlog = this.featureBlog.bind(this);
    this.getFeaturedPost = this.getFeaturedPost.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.getUserBlogs = this.getUserBlogs.bind(this);
  }

  public async getAllBlogs(req: Request, res: Response) {
    const { error, value } = getAllBlogsValidations.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const data = await this.blogService.getAll(value);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }

  public async getFeaturedPost(req: Request, res: Response) {
    const data = await this.blogService.getFeaturedBlogs();
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }

  public async getBlog(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Blog ID is required" });
    }
    const data = await this.blogService.getBlogById(id);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }

  public async CreateBlog(req: Request, res: Response) {
    const { title, desc, category } = req.body;
    if (!title || !desc) {
      return res
        .status(400)
        .json({ error: "Title and Description are required" });
    }
    const { userId } = req.user;
    const data = await this.blogService.CreateBlog({
      title,
      desc,
      category,
      userId,
    });
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }
  public async deleteBlog(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Blog ID is required" });
    }
    const { role, userId } = req.body;
    const data = await this.blogService.deleteBlog(id, role, userId);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }
  public async featureBlog(req: Request, res: Response) {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Blog ID is required" });
    }
    const data = await this.blogService.featureBlog(id);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }

  public async getUserProfile(req: Request, res: Response) {
    const { userId } = req.user;
    const data = await this.blogService.getUserProfileInfo(userId);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }

  public async getUserBlogs(req: Request, res: Response) {
    const { userId } = req.user;
    const data = await this.blogService.getUserAllBlogs(userId);
    const statusCode = data?.success ? (data.error === null ? 200 : 404) : 400;
    return res.status(statusCode).json(data?.data);
  }
}
export { BlogController };
