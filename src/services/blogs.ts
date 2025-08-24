import blogs from "../db/model/blogs";
import { User } from "../db/model/user";

class BlogService {
  async getAllBlogs(params: any) {
    try {
      const pageNumber = Number(params.page) || 1;
      const limitNumber = Number(params.limit) || 2;
      const query: any = {};

      const cat = params.category;
      const author = params.author;
      const searchQuery = params.searchQuery;
      const sortQuery = params.sortQuery;
      const featured = params.featured;

      if (cat) {
        query.category = cat;
      }

      if (searchQuery) {
        query.title = { $regex: searchQuery, $options: "i" };
      }

      if (author) {
        const user = await User.findOne({ username: author }).select("_id");

        if (!user) {
          return { success: true, data: [], error: "No Blogs Found" };
        }

        query.user = user._id;
        let sortObj: any = { createdAt: -1 };

        if (sortQuery) {
          switch (sortQuery) {
            case "newest":
              sortObj = { createdAt: -1 };
              break;
            case "oldest":
              sortObj = { createdAt: 1 };
              break;
            case "popular":
              sortObj = { visit: -1 };
              break;
            case "trending":
              sortObj = { visit: -1 };
              query.createdAt = {
                $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
              };
              break;
            default:
              break;
          }
        }

        if (featured) {
          query.isFeatured = true;
        }

        const posts = await blogs
          .find(query)
          .populate("user", "username")
          .sort(sortObj)
          .limit(limitNumber)
          .skip((pageNumber - 1) * limitNumber);

        const totalBlogs = await blogs.countDocuments();
        const hasMore = pageNumber * limitNumber < totalBlogs;

        return {
          success: true,
          data: { blogs, hasMore },
          error: null,
        };
      }
    } catch (error) {
      console.log("Error fetching blogs:", error);
      return { success: false, data: null, error: "Failed to fetch blogs" };
    }
  }

  async getBlogById(id: string) {
    try {
      const blog = await blogs.findById(id).populate("user", "username img_id");
      if (!blog) {
        return { success: false, data: null, error: "Blog not found" };
      }
      return { success: true, data: blog, error: null };
    } catch (error) {
      console.log("Error fetching blog by ID:", error);
      return { success: false, data: null, error: "Failed to fetch blog" };
    }
  }

  async CreateBlog(blogData: any) {
    try {
      const user = await User.findById(blogData.userId);

      if (!user) {
        return { success: false, data: null, error: "User not found" };
      }
      let slug = blogData.title.replace(/ /g, "-").toLowerCase();

      let existingPost = await blogs.findOne({ slug });

      let counter = 2;

      while (existingPost) {
        slug = `${slug}-${counter}`;
        existingPost = await blogs.findOne({ slug });
        counter++;
      }

      const newBlogs = new blogs({ user: user._id, slug, ...blogData });
      const blog = await newBlogs.save();

      return { success: true, data: blog, error: null };
    } catch (error) {
      console.log("Error creating blog:", error);
      return { success: false, data: null, error: "Failed to create blog" };
    }
  }

  async deleteBlog(id: string, role: string, userId: string) {
    try {
      if (role === "admin") {
        const blog = await blogs.findByIdAndDelete(id);
        return { success: true, data: blog, error: null };
      }

      const blog = await blogs.findOneAndDelete({
        _id: id,
        user: userId,
      });
      if (!blog) {
        return { success: false, data: null, error: "Blog not found" };
      }

      return { success: true, data: blog, error: null };
    } catch (error) {
      console.log("Error deleting blog:", error);
      return { success: false, data: null, error: "Failed to delete blog" };
    }
  }

  async featureBlog(id: string) {
    try {
      const blog = await blogs.findById(id);
      if (!blog) {
        return { success: false, data: null, error: "Blog not found" };
      }

      blog.isFeatured = !blog.isFeatured;
      await blog.save();

      return { success: true, data: blog, error: null };
    } catch (error) {
      console.log("Error featuring blog:", error);
      return { success: false, data: null, error: "Failed to feature blog" };
    }
  }
}
export { BlogService };
