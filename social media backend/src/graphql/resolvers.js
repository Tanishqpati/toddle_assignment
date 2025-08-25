const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const likeModel = require("../models/like");
const followModel = require("../models/follow");
const jwtUtils = require("../utils/jwt");

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return userModel.getUserById(user.userId);
    },
    user: (_, { id }) => userModel.getUserById(id),
    users: (_, { search }) => userModel.findUsersByName(search || ""),
    post: (_, { id }) => postModel.getPostById(id),
    posts: (_, { userId, search }) => {
      if (userId) return postModel.getPostsByUserId(userId, 20, 0);
      if (search) return postModel.searchPosts(search, 20, 0);
      return [];
    },
    feed: (_, __, { user }) => {
      if (!user) return [];
      return postModel.getFeedPosts(user.userId, 20, 0);
    },
    comments: (_, { postId }) => commentModel.getPostComments(postId, 20, 0),
    likes: (_, { postId }) => likeModel.getLikesByPostId(postId),
    followers: (_, { userId }) => followModel.getFollowers(userId),
    following: (_, { userId }) => followModel.getFollowing(userId),
  },
  Mutation: {
    register: async (_, { username, email, password, full_name }) => {
      // Reuse REST logic
      const user = await userModel.createUser({
        username,
        email,
        password,
        full_name,
      });
      const token = jwtUtils.generateToken({
        userId: user.id,
        username: user.username,
      });
      return { token, user };
    },
    login: async (_, { email, password, username }) => {
      // Reuse REST logic: allow login by username or email
      let user;
      if (username) {
        user = await userModel.getUserByUsername(username);
      } else if (email) {
        // If you want to support email login, you can add getUserByEmail in user.js
        const result = await require("../utils/database").query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        user = result.rows[0];
      }
      if (!user) throw new Error("Invalid credentials");
      const isValidPassword = await userModel.verifyPassword(
        password,
        user.password_hash
      );
      if (!isValidPassword) throw new Error("Invalid credentials");
      const token = jwtUtils.generateToken({
        userId: user.id,
        username: user.username,
      });
      return { token, user };
    },
    updateProfile: async (_, { bio, avatar }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return userModel.updateUserProfile(user.userId, { bio, avatar });
    },
    createPost: async (_, args, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return postModel.createPost({ ...args, user_id: user.userId });
    },
    updatePost: async (_, { id, ...args }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return postModel.updatePost(id, user.userId, args);
    },
    deletePost: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return postModel.deletePost(id, user.userId);
    },
    likePost: async (_, { postId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return likeModel.likePost(user.userId, postId);
    },
    unlikePost: async (_, { postId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return likeModel.unlikePost(user.userId, postId);
    },
    commentPost: async (_, { postId, content }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return commentModel.createComment({
        user_id: user.userId,
        post_id: postId,
        content,
      });
    },
    updateComment: async (_, { id, content }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return commentModel.updateComment(id, user.userId, content);
    },
    deleteComment: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return commentModel.deleteComment(id, user.userId);
    },
    followUser: async (_, { userId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return followModel.followUser(user.userId, userId);
    },
    unfollowUser: async (_, { userId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return followModel.unfollowUser(user.userId, userId);
    },
  },
  User: {
    followersCount: (parent) =>
      followModel.getFollowCounts(parent.id).then((c) => c.followerCount),
    followingCount: (parent) =>
      followModel.getFollowCounts(parent.id).then((c) => c.followingCount),
    posts: (parent) => postModel.getPostsByUserId(parent.id, 20, 0),
  },
  Post: {
    user: (parent) => userModel.getUserById(parent.user_id || parent.userId),
    likeCount: async (parent) => {
      const likes = await likeModel.getLikesByPostId(parent.id);
      return likes.length;
    },
    commentCount: async (parent) => {
      const comments = await commentModel.getPostComments(parent.id, 1000, 0);
      return comments.length;
    },
    comments: (parent) => commentModel.getPostComments(parent.id, 20, 0),
    likes: (parent) => likeModel.getLikesByPostId(parent.id),
  },
  Comment: {
    user: (parent) => userModel.getUserById(parent.user_id || parent.userId),
    post: (parent) => postModel.getPostById(parent.post_id || parent.postId),
  },
  Like: {
    user: (parent) => userModel.getUserById(parent.user_id || parent.userId),
    post: (parent) => postModel.getPostById(parent.post_id || parent.postId),
  },
  Follow: {
    follower: (parent) => userModel.getUserById(parent.follower_id),
    following: (parent) => userModel.getUserById(parent.following_id),
  },
};

module.exports = resolvers;
