const { query } = require("../utils/database");

/**
 * Follow model for managing user relationships
 * TODO: Implement this model for the follow functionality
 */

/**
 * Follow a user
 * @param {number} followerId - The user who follows
 * @param {number} followingId - The user to be followed
 * @returns {Promise<boolean>} Success status
 */
const followUser = async (followerId, followingId) => {
  try {
    // First try to insert
    const insertResult = await query(
      `INSERT INTO follow (follower_id, following_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING RETURNING id, follower_id, following_id, created_at`,
      [followerId, followingId]
    );

    // If insert worked, return the new record
    if (insertResult.rows.length > 0) {
      return insertResult.rows[0];
    }

    // If no insert (conflict), get the existing record
    const existingResult = await query(
      `SELECT id, follower_id, following_id, created_at FROM follow WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId]
    );

    return existingResult.rows[0] || null;
  } catch (error) {
    return null;
  }
};

/**
 * Unfollow a user
 * @param {number} followerId - The user who unfollows
 * @param {number} followingId - The user to be unfollowed
 * @returns {Promise<boolean>} Success status
 */
const unfollowUser = async (followerId, followingId) => {
  const result = await query(
    `DELETE FROM follow WHERE follower_id = $1 AND following_id = $2`,
    [followerId, followingId]
  );
  return result.rowCount > 0;
};

/**
 * Get followers of a user with details
 * @param {number} userId - The user whose followers to fetch
 * @returns {Promise<Array>} Array of follower user details
 */
const getFollowers = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM follow f
     JOIN users u ON f.follower_id = u.id
     WHERE f.following_id = $1`,
    [userId]
  );
  return result.rows;
};

/**
 * Get users followed by a user with details
 * @param {number} userId - The user whose followings to fetch
 * @returns {Promise<Array>} Array of following user details
 */
const getFollowing = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM follow f
     JOIN users u ON f.following_id = u.id
     WHERE f.follower_id = $1`,
    [userId]
  );
  return result.rows;
};

/**
 * Get follower and following counts for a user
 * @param {number} userId - The user whose counts to fetch
 * @returns {Promise<Object>} Object with followerCount and followingCount
 */
const getFollowCounts = async (userId) => {
  const followerResult = await query(
    `SELECT COUNT(*)::int AS count FROM follow WHERE following_id = $1`,
    [userId]
  );
  const followingResult = await query(
    `SELECT COUNT(*)::int AS count FROM follow WHERE follower_id = $1`,
    [userId]
  );
  return {
    followerCount: followerResult.rows[0].count,
    followingCount: followingResult.rows[0].count,
  };
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCounts,
};
