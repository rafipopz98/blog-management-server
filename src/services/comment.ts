import { comment } from "../db/model/comment";

class CommentService {
  async blogsComment(blogId: string) {
    try {
      const comments = await comment
        .find({ post: blogId })
        .populate("user", "username img_id")
        .sort({ createdAt: -1 });
      return { success: true, data: comments, error: null };
    } catch (error) {
      console.log("Error fetching comments:", error);
      return { success: false, data: null, error: "Failed to fetch comments" };
    }
  }
  async addComment(blogId: string, userId: string, desc: string) {
    try {
      const newComment = new comment({
        post: blogId,
        user: userId,
        desc,
      });
      await newComment.save();
      return { success: true, data: newComment, error: null };
    } catch (error) {
      console.log("Error adding comment:", error);
      return { success: false, data: null, error: "Failed to add comment" };
    }
  }
  async deleteComment(commentId: string, userId: string, role: string) {
    try {
      if (role === "admin") {
        const deletedComment = await comment.findByIdAndDelete(commentId);
      }
      const deletedComment = await comment.findOneAndDelete({
        _id: commentId,
        user: userId,
      });
      return { success: true, data: deletedComment, error: null };
    } catch (error) {
      console.log("Error deleting comment:", error);
      return { success: false, data: null, error: "Failed to delete comment" };
    }
  }
}
export { CommentService };
