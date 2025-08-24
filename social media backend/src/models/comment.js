const { query } = require("../utils/database");

/**
 * Create a comment on a post
 * @param {Object} commentData - { user_id, post_id, content }
 * @returns {Promise<Object>} Created comment
 */
const createComment = async ({ user_id, post_id, content }) => {
  const result = await query(
    `INSERT INTO comment (user_id, post_id, content, created_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING id, user_id, post_id, content, created_at`,
    [user_id, post_id, content]
  );
  return result.rows[0];
};

/**
 * Update user's own comment
 * @param {number} commentId
 * @param {number} userId
 * @param {string} content
 * @returns {Promise<boolean>} Success status
 */
const updateComment = async (commentId, userId, content) => {
  const result = await query(
    `UPDATE comment SET content = $1 WHERE id = $2 AND user_id = $3`,
    [content, commentId, userId]
  );
  return result.rowCount > 0;
};

/**
 * Delete user's own comment
 * @param {number} commentId
 * @param {number} userId
 * @returns {Promise<boolean>} Success status
 */
const deleteComment = async (commentId, userId) => {
  const result = await query(
    `DELETE FROM comment WHERE id = $1 AND user_id = $2`,
    [commentId, userId]
  );
  return result.rowCount > 0;
};

/**
 * Get comments for a post (with pagination)
 * @param {number} postId
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<Array>} Array of comments
 */
const getPostComments = async (postId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT c.*, u.username, u.full_name
     FROM comment c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC
     LIMIT $2 OFFSET $3`,
    [postId, limit, offset]
  );
  return result.rows;
};

/**
 * Get a comment by its ID
 * @param {number} commentId
 * @returns {Promise<Object|null>} Comment object or null
 */
const getCommentById = async (commentId) => {
  const result = await query(
    `SELECT c.*, u.username, u.full_name
     FROM comment c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [commentId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
  getCommentById,
};
