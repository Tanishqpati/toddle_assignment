const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

/**
 * User model for database operations
 */

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name],
  );

  return result.rows[0];
};

/**
 * Find user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object|null>} User object or null
 */
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0] || null;
};

/**
 * Verify user password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Password match result
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Find users by (partial) name or username, with pagination
 * @param {string} queryText
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<Array>} Array of users
 */
const findUsersByName = async (queryText, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT id, username, email, full_name, created_at
     FROM users
     WHERE (username ILIKE $1 OR full_name ILIKE $1) AND is_deleted = false
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${queryText}%`, limit, offset]
  );
  return result.rows;
};

/**
 * Get user profile with follower/following counts
 * @param {number} userId
 * @returns {Promise<Object|null>} User profile with counts
 */
const getUserProfile = async (userId) => {
  const userResult = await query(
    `SELECT id, username, email, full_name, created_at FROM users WHERE id = $1 AND is_deleted = false`,
    [userId]
  );
  if (!userResult.rows[0]) return null;
  const followerResult = await query(
    `SELECT COUNT(*)::int AS count FROM follow WHERE following_id = $1`,
    [userId]
  );
  const followingResult = await query(
    `SELECT COUNT(*)::int AS count FROM follow WHERE follower_id = $1`,
    [userId]
  );
  return {
    ...userResult.rows[0],
    followerCount: followerResult.rows[0].count,
    followingCount: followingResult.rows[0].count,
  };
};

/**
 * Update user profile
 * @param {number} userId
 * @param {Object} updateData - { full_name, email }
 * @returns {Promise<boolean>} Success status
 */
const updateUserProfile = async (userId, { full_name, email }) => {
  const result = await query(
    `UPDATE users SET full_name = COALESCE($1, full_name), email = COALESCE($2, email)
     WHERE id = $3 AND is_deleted = false`,
    [full_name, email, userId]
  );
  return result.rowCount > 0;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile,
};
