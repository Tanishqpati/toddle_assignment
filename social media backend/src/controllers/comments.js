const {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
} = require("../models/comment");
const { getPostById } = require("../models/post");
const logger = require("../utils/logger");

/**
 * Create a comment on a post
 */
const createCommentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.body;
    const { content } = req.body;
    const post = await getPostById(parseInt(post_id));
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.comments_enabled === false) {
      return res
        .status(403)
        .json({ error: "Comments are disabled for this post" });
    }
    const comment = await createComment({
      user_id: userId,
      post_id: parseInt(post_id),
      content,
    });
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    logger.critical("Create comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update user's own comment
 */
const updateCommentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;
    const { content } = req.body;
    const updated = await updateComment(comment_id, userId, content);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });
    }
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    logger.critical("Update comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete user's own comment
 */
const deleteCommentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;
    const deleted = await deleteComment(comment_id, userId);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.critical("Delete comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get comments for a post (with pagination)
 */
const getPostCommentsController = async (req, res) => {
  try {
    const { post_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const comments = await getCommentsByPostId(
      parseInt(post_id),
      limit,
      offset
    );
    res.json({
      comments,
      pagination: { page, limit, hasMore: comments.length === limit },
    });
  } catch (error) {
    logger.critical("Get post comments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createComment: createCommentController,
  updateComment: updateCommentController,
  deleteComment: deleteCommentController,
  getPostComments: getPostCommentsController,
};
