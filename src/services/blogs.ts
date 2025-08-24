import { blogs } from "../db/model/blogs";
import { User } from "../db/model/user";

class BlogService {
  async getAll(params: any) {
    try {
      const skipNumber = Number(params.skip) || 0;
      const limitNumber = Number(params.limit) || 2;

      const query: any = {};

      if (params.category) query.category = params.category;
      if (params.searchQuery)
        query.title = { $regex: params.searchQuery, $options: "i" };

      if (params.author) {
        const user = await User.findOne({ username: params.author }).select(
          "_id"
        );
        if (!user)
          return {
            success: true,
            data: { data: [], hasMore: false, total: 0 },
            error: null,
          };
        query.user = user._id;
      }

      const blog = await blogs
        .find(query)
        .populate("user", "username")
        .limit(limitNumber)
        .skip(skipNumber)
        .sort({ createdAt: -1 });

      const totalBlogs = await blogs.countDocuments(query);

      const hasMore = skipNumber + limitNumber < totalBlogs;

      return {
        success: true,
        data: { data: blog, hasMore, total: totalBlogs },
        error: null,
      };
    } catch (error) {
      console.log("Error fetching blogs:", error);
      return { success: false, data: null, error: "Failed to fetch blogs" };
    }
  }

  async getFeaturedBlogs() {
    try {
      const featuredBlogs = await blogs
        .find({ isFeatured: true })
        .populate("user", "username")
        .sort({ createdAt: -1 })
        .limit(4);
      return { success: true, data: featuredBlogs, error: null };
    } catch (error) {
      console.log("Error fetching featured blogs:", error);
      return {
        success: false,
        data: null,
        error: "Failed to fetch featured blogs",
      };
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
      const { title, desc, category, userId } = blogData;
      const newBlog = new blogs({
        title,
        desc,
        category,
        user: userId,
      });
      await newBlog.save();
      return { success: true, data: newBlog, error: null };
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
        return {
          success: false,
          data: null,
          error: "You can delete only your blogs",
        };
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

  async getUserProfileInfo(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: true, data: null, error: null };
      }
      const finalData = {
        username: user.username,
        email: user.email,
        id: user._id,
      };
      return { success: true, data: finalData, error: null };
    } catch (error) {
      console.log("Error fetching user profile info:", error);
      return {
        success: false,
        data: null,
        error: "Failed to fetch user profile info",
      };
    }
  }

  async getUserAllBlogs(userId: string) {
    try {
      const allBlogs = await blogs
        .find({ user: userId })
        .sort({ createdAt: -1 });
      return { success: true, data: allBlogs, error: null };
    } catch (error) {
      console.log("Error fetching user profile info:", error);
      return {
        success: false,
        data: null,
        error: "Failed to fetch user profile info",
      };
    }
  }
}
export { BlogService };
