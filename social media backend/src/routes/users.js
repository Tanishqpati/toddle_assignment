const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCounts,
} = require("../models/follow");
const { getUserById } = require("../models/user");

const router = express.Router();

/**
 * User-related routes
 * TODO: Implement user routes when follow functionality is added
 */

// POST /api/users/:user_id/follow - Follow a user
router.post("/:user_id/follow", authenticateToken, async (req, res) => {
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
});

// POST /api/users/:user_id/unfollow - Unfollow a user
router.delete("/:user_id/unfollow", authenticateToken, async (req, res) => {
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
});

// GET /api/users/:user_id/followers - Get followers of a user
router.get("/:user_id/followers", async (req, res) => {
  const userId = parseInt(req.params.user_id);
  const followers = await getFollowers(userId);
  res.json({ followers });
});

// GET /api/users/:user_id/following - Get users followed by a user
router.get("/:user_id/following", async (req, res) => {
  const userId = parseInt(req.params.user_id);
  const following = await getFollowing(userId);
  res.json({ following });
});

// GET /api/users/:user_id/follow-counts - Get follower and following counts for a user
router.get("/:user_id/follow-counts", async (req, res) => {
  const userId = parseInt(req.params.user_id);
  const counts = await getFollowCounts(userId);
  res.json(counts);
});

module.exports = router;
