const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCounts,
} = require("../models/follow");
const { getUserById } = require("../models/user");
const logger = require("../utils/logger");

/**
 * Follow a user
 */
const follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.user_id);
    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }
    const user = await getUserById(followingId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const success = await followUser(followerId, followingId);
    if (success) {
      return res.json({ message: "Followed user successfully." });
    } else {
      return res.status(500).json({ error: "Failed to follow user." });
    }
  } catch (error) {
    logger.critical("Follow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.user_id);
    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot unfollow yourself." });
    }
    const user = await getUserById(followingId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const success = await unfollowUser(followerId, followingId);
    if (success) {
      return res.json({ message: "Unfollowed user successfully." });
    } else {
      return res.status(500).json({ error: "Failed to unfollow user." });
    }
  } catch (error) {
    logger.critical("Unfollow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users that the current user is following
 */
const getMyFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await getFollowing(userId);
    res.json({ following });
  } catch (error) {
    logger.critical("Get my following error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users that follow the current user
 */
const getMyFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await getFollowers(userId);
    res.json({ followers });
  } catch (error) {
    logger.critical("Get my followers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get follow counts for a user
 */
const getFollowCountsController = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    const counts = await getFollowCounts(userId);
    res.json(counts);
  } catch (error) {
    logger.critical("Get follow counts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowCounts: getFollowCountsController,
};
