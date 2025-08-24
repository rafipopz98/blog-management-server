import { blogs } from "../db/model/blogs";
import { User } from "../db/model/user";

class BlogService {
  async getAll(params: any) {
    try {
      const skipNumber = Number(params.skip) || 0;
      const limitNumber = Number(params.limit) || 2;

      const pipeline: any[] = [];

      pipeline.push({
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      });

      pipeline.push({
        $unwind: "$user",
      });

      const match: any = {};

      if (params.category) {
        match.category = params.category;
      }

      if (params.searchQuery) {
        const regex = { $regex: params.searchQuery, $options: "i" };
        match.$or = [
          { title: regex },
          { category: regex },
          { "user.username": regex },
          { "user.email": regex },
        ];
      }

      if (Object.keys(match).length > 0) {
        pipeline.push({ $match: match });
      }

      let sort: any = { createdAt: -1 };
      if (params.sortQuery) {
        const order = params.sortQuery === "asc" ? 1 : -1;
        sort = { createdAt: order };
      }
      pipeline.push({ $sort: sort });

      pipeline.push({ $skip: skipNumber });
      pipeline.push({ $limit: limitNumber });

      pipeline.push({
        $project: {
          title: 1,
          desc: 1,
          category: 1,
          isFeatured: 1,
          visit: 1,
          createdAt: 1,
          "user.username": 1,
          "user.email": 1,
        },
      });

      console.log(pipeline[3]);

      const blog = await blogs.aggregate(pipeline);

      const countPipeline = [...pipeline];
      countPipeline.splice(
        countPipeline.findIndex((stage) => stage.$skip !== undefined),
        2
      );
      const totalBlogs = (await blogs.aggregate(countPipeline)).length;

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

  async updateBlog(blogData: {
    id: string;
    title?: string;
    desc?: string;
    category?: string;
    role: string;
    userId: string;
  }) {
    try {
      const { id, title, desc, category, role, userId } = blogData;

      const query = role === "admin" ? { _id: id } : { _id: id, user: userId };
      const blog = await blogs.findOne(query);

      if (!blog) {
        return {
          success: false,
          data: null,
          error: "Blog not found or access denied",
        };
      }
      const updatedData = {
        title: title ?? blog.title,
        desc: desc ?? blog.desc,
        category: category ?? blog.category,
      };

      const updatedBlog = await blogs.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      return { success: true, data: updatedBlog, error: null };
    } catch (error) {
      console.error("Error updating blog:", error);
      return { success: false, data: null, error: "Failed to update blog" };
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
