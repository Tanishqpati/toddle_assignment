const { query } = require("../utils/database");

/**
 * Post model for database operations
 */

/**
 * Create a new post (with optional scheduled time)
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */
const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
  scheduled_at = null,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, created_at, is_deleted, scheduled_at)
     VALUES ($1, $2, $3, $4, NOW(), false, $5)
     RETURNING id, user_id, content, media_url, comments_enabled, created_at, scheduled_at`,
    [user_id, content, media_url, comments_enabled, scheduled_at]
  );

  return result.rows[0];
};

/**
 * Get post by ID
 * @param {number} postId - Post ID
 * @returns {Promise<Object|null>} Post object or null
 */
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [postId]
  );

  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
      (SELECT COUNT(*) FROM "like" WHERE post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comment WHERE post_id = p.id) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 AND p.is_deleted = false
     AND (p.scheduled_at IS NULL OR p.scheduled_at <= NOW())
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = true WHERE id = $1 AND user_id = $2",
    [postId, userId]
  );

  return result.rowCount > 0;
};

/**
 * Get feed posts (posts from users the current user follows) with like and comment counts, only show posts scheduled for now or earlier
 * @param {number} userId - Current user ID
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<Array>} Array of posts
 */
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
      (SELECT COUNT(*) FROM "like" WHERE post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comment WHERE post_id = p.id) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE (p.user_id IN (
       SELECT following_id FROM follow WHERE follower_id = $1
     ) OR p.user_id = $1)
     AND p.is_deleted = false
     AND (p.scheduled_at IS NULL OR p.scheduled_at <= NOW())
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

/**
 * Update a post
 * @param {number} postId
 * @param {number} userId
 * @param {Object} updateData - { content, media_url, comments_enabled }
 * @returns {Promise<boolean>} Success status
 */
const updatePost = async (
  postId,
  userId,
  { content, media_url, comments_enabled }
) => {
  const result = await query(
    `UPDATE posts SET content = COALESCE($1, content), media_url = COALESCE($2, media_url), comments_enabled = COALESCE($3, comments_enabled)
     WHERE id = $4 AND user_id = $5 AND is_deleted = false`,
    [content, media_url, comments_enabled, postId, userId]
  );
  return result.rowCount > 0;
};

/**
 * Search posts by content
 * @param {string} queryText
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<Array>} Array of posts
 */
const searchPosts = async (queryText, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.is_deleted = false AND p.content ILIKE $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${queryText}%`, limit, offset]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts,
};
