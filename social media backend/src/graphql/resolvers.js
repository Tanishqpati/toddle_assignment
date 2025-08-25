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
      return userModel.getById(user.id);
    },
    user: (_, { id }) => userModel.getById(id),
    users: (_, { search }) => userModel.search(search),
    post: (_, { id }) => postModel.getById(id),
    posts: (_, { userId, search }) => postModel.getAll({ userId, search }),
    feed: (_, __, { user }) => postModel.getFeed(user?.id),
    comments: (_, { postId }) => commentModel.getByPostId(postId),
    likes: (_, { postId }) => likeModel.getByPostId(postId),
    followers: (_, { userId }) => followModel.getFollowers(userId),
    following: (_, { userId }) => followModel.getFollowing(userId),
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const user = await userModel.create({ username, email, password });
      const token = jwtUtils.generateToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await userModel.verifyCredentials(email, password);
      if (!user) throw new Error("Invalid credentials");
      const token = jwtUtils.generateToken(user);
      return { token, user };
    },
    updateProfile: async (_, { bio, avatar }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return userModel.update(user.id, { bio, avatar });
    },
    createPost: async (_, args, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return postModel.create({ ...args, userId: user.id });
    },
    updatePost: async (_, { id, ...args }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return postModel.update(id, args, user.id);
    },
    deletePost: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return postModel.delete(id, user.id);
    },
    likePost: async (_, { postId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return likeModel.like(postId, user.id);
    },
    unlikePost: async (_, { postId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return likeModel.unlike(postId, user.id);
    },
    commentPost: async (_, { postId, content }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return commentModel.create({ postId, userId: user.id, content });
    },
    updateComment: async (_, { id, content }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return commentModel.update(id, content, user.id);
    },
    deleteComment: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return commentModel.delete(id, user.id);
    },
    followUser: async (_, { userId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return followModel.follow(user.id, userId);
    },
    unfollowUser: async (_, { userId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return followModel.unfollow(user.id, userId);
    },
  },
  User: {
    followersCount: (parent) => followModel.countFollowers(parent.id),
    followingCount: (parent) => followModel.countFollowing(parent.id),
    posts: (parent) => postModel.getAll({ userId: parent.id }),
  },
  Post: {
    user: (parent) => userModel.getById(parent.user_id || parent.userId),
    likeCount: (parent) => likeModel.countByPost(parent.id),
    commentCount: (parent) => commentModel.countByPost(parent.id),
    comments: (parent) => commentModel.getByPostId(parent.id),
    likes: (parent) => likeModel.getByPostId(parent.id),
  },
  Comment: {
    user: (parent) => userModel.getById(parent.user_id || parent.userId),
    post: (parent) => postModel.getById(parent.post_id || parent.postId),
  },
  Like: {
    user: (parent) => userModel.getById(parent.user_id || parent.userId),
    post: (parent) => postModel.getById(parent.post_id || parent.postId),
  },
  Follow: {
    follower: (parent) => userModel.getById(parent.follower_id),
    following: (parent) => userModel.getById(parent.following_id),
  },
};

module.exports = resolvers;
