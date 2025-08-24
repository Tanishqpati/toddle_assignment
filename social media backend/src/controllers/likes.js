const {
  likePost,
  unlikePost,
  getLikesByPostId,
  getLikesByUserId,
} = require("../models/like");
const logger = require("../utils/logger");

/**
 * Like a post
 */
const likePostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.params;
    const liked = await likePost(userId, parseInt(post_id));
    if (!liked) {
      return res
        .status(400)
        .json({ error: "Already liked or failed to like post" });
    }
    res.json({ message: "Post liked successfully" });
  } catch (error) {
    logger.critical("Like post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unlike a post
 */
const unlikePostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.params;
    const unliked = await unlikePost(userId, parseInt(post_id));
    if (!unliked) {
      return res
        .status(400)
        .json({ error: "Post not liked or failed to unlike" });
    }
    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    logger.critical("Unlike post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get likes for a post
 */
const getPostLikesController = async (req, res) => {
  try {
    const { post_id } = req.params;
    const likes = await getLikesByPostId(parseInt(post_id));
    res.json({ likes });
  } catch (error) {
    logger.critical("Get post likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts liked by a user
 */
const getUserLikesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const likes = await getLikesByUserId(userId);
    res.json({ likes });
  } catch (error) {
    logger.critical("Get user likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  likePost: likePostController,
  unlikePost: unlikePostController,
  getPostLikes: getPostLikesController,
  getUserLikes: getUserLikesController,
};
