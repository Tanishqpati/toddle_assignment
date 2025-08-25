const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    full_name: String!
    bio: String
    avatar: String
    followersCount: Int
    followingCount: Int
    posts: [Post]
    createdAt: String
    updatedAt: String
  }

  type Post {
    id: ID!
    user: User!
    content: String!
    image: String
    scheduledAt: String
    createdAt: String
    updatedAt: String
    likeCount: Int
    commentCount: Int
    comments: [Comment]
    likes: [Like]
    commentsEnabled: Boolean
    deleted: Boolean
  }

  type Comment {
    id: ID!
    post: Post!
    user: User!
    content: String!
    createdAt: String
    updatedAt: String
  }

  type Like {
    id: ID!
    post: Post!
    user: User!
    createdAt: String
  }

  type Follow {
    id: ID!
    follower: User!
    following: User!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    user(id: ID!): User
    users(search: String): [User]
    post(id: ID!): Post
    posts(userId: ID, search: String): [Post]
    feed: [Post]
    comments(postId: ID!): [Comment]
    likes(postId: ID!): [Like]
    followers(userId: ID!): [User]
    following(userId: ID!): [User]
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      full_name: String!
    ): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateProfile(bio: String, avatar: String): User
    createPost(
      content: String!
      image: String
      scheduledAt: String
      commentsEnabled: Boolean
    ): Post
    updatePost(
      id: ID!
      content: String
      image: String
      commentsEnabled: Boolean
    ): Post
    deletePost(id: ID!): Boolean
    likePost(postId: ID!): Like
    unlikePost(postId: ID!): Boolean
    commentPost(postId: ID!, content: String!): Comment
    updateComment(id: ID!, content: String!): Comment
    deleteComment(id: ID!): Boolean
    followUser(userId: ID!): Follow
    unfollowUser(userId: ID!): Boolean
  }
`;

module.exports = typeDefs;
