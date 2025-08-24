const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 * TODO: Implement this model for the like functionality
 */

/**
 * Like a post
 * @param {number} userId
 * @param {number} postId
 * @returns {Promise<boolean>} Success status
 */
const likePost = async (userId, postId) => {
  try {
    await query(
      `INSERT INTO like (user_id, post_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
      [userId, postId]
    );
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Unlike a post
 * @param {number} userId
 * @param {number} postId
 * @returns {Promise<boolean>} Success status
 */
const unlikePost = async (userId, postId) => {
  const result = await query(
    `DELETE FROM like WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

/**
 * Get likes for a post (with user info)
 * @param {number} postId
 * @returns {Promise<Array>} Array of users who liked the post
 */
const getLikesByPostId = async (postId) => {
  const result = await query(
    `SELECT l.user_id, u.username, u.full_name
     FROM like l
     JOIN users u ON l.user_id = u.id
     WHERE l.post_id = $1`,
    [postId]
  );
  return result.rows;
};

/**
 * Get posts liked by a user (with post info)
 * @param {number} userId
 * @returns {Promise<Array>} Array of liked posts
 */
const getLikesByUserId = async (userId) => {
  const result = await query(
    `SELECT l.post_id, p.content, p.media_url, p.created_at
     FROM like l
     JOIN posts p ON l.post_id = p.id
     WHERE l.user_id = $1`,
    [userId]
  );
  return result.rows;
};

/**
 * Check if a user has liked a post
 * @param {number} userId
 * @param {number} postId
 * @returns {Promise<boolean>} True if liked, else false
 */
const hasUserLikedPost = async (userId, postId) => {
  const result = await query(
    `SELECT 1 FROM like WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rows.length > 0;
};

module.exports = {
  likePost,
  unlikePost,
  getLikesByPostId,
  getLikesByUserId,
  hasUserLikedPost,
};
