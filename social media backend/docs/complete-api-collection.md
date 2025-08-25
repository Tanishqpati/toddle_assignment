# Complete API Collection - Social Media Backend

This collection includes all working REST and GraphQL endpoints with proper authentication and testing examples.

## Environment Setup

```bash
# Set base URLs
REST_BASE_URL="http://localhost:3000"
GRAPHQL_URL="http://localhost:3000/graphql"

# Test token (get from login)
TOKEN="your_jwt_token_here"
```

## 🔐 Authentication Endpoints

### REST - Register User
```bash
curl -X POST $REST_BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com", 
    "password": "password123",
    "full_name": "New User"
  }'
```

### REST - Login User
```bash
curl -X POST $REST_BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### GraphQL - Register User
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { register(username: \"graphqluser\", email: \"graphql@example.com\", password: \"password123\", full_name: \"GraphQL User\") { token user { id username email full_name } } }"
  }'
```

### GraphQL - Login User
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"test@example.com\", password: \"password123\") { token user { id username email full_name } } }"
  }'
```

## 👤 User Management Endpoints

### REST - Get Current User Profile
```bash
curl -X GET $REST_BASE_URL/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Update User Profile
```bash
curl -X PUT $REST_BASE_URL/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio text",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

### REST - Get User by ID
```bash
curl -X GET $REST_BASE_URL/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Search Users
```bash
curl -X GET "$REST_BASE_URL/users/search?q=test" \
  -H "Authorization: Bearer $TOKEN"
```

### GraphQL - Get Current User (Me)
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { me { id username email full_name bio avatar followersCount followingCount createdAt } }"
  }'
```

### GraphQL - Update Profile
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { updateProfile(bio: \"Updated via GraphQL\", avatar: \"https://example.com/new-avatar.jpg\") { id username bio avatar } }"
  }'
```

### GraphQL - Get User by ID
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { user(id: \"1\") { id username email full_name bio followersCount followingCount } }"
  }'
```

### GraphQL - Search Users
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { users(search: \"test\") { id username email full_name } }"
  }'
```

## 📝 Post Management Endpoints

### REST - Create Post
```bash
curl -X POST $REST_BASE_URL/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my new post!",
    "image": "https://example.com/image.jpg",
    "commentsEnabled": true
  }'
```

### REST - Get User Posts
```bash
curl -X GET $REST_BASE_URL/posts/user/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Get Post by ID
```bash
curl -X GET $REST_BASE_URL/posts/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Update Post
```bash
curl -X PUT $REST_BASE_URL/posts/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated post content",
    "commentsEnabled": false
  }'
```

### REST - Delete Post
```bash
curl -X DELETE $REST_BASE_URL/posts/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Get Feed
```bash
curl -X GET $REST_BASE_URL/posts/feed \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Search Posts
```bash
curl -X GET "$REST_BASE_URL/posts/search?q=test" \
  -H "Authorization: Bearer $TOKEN"
```

### GraphQL - Create Post
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { createPost(content: \"GraphQL post content\", image: \"https://example.com/gql-image.jpg\", commentsEnabled: true) { id content image user { username } createdAt likeCount commentCount } }"
  }'
```

### GraphQL - Get Posts by User
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { posts(userId: \"1\") { id content image user { username } createdAt likeCount commentCount } }"
  }'
```

### GraphQL - Get Post by ID
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { post(id: \"1\") { id content image user { username } createdAt likeCount commentCount commentsEnabled } }"
  }'
```

### GraphQL - Update Post
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { updatePost(id: \"1\", content: \"Updated via GraphQL\", commentsEnabled: false) { id content commentsEnabled updatedAt } }"
  }'
```

### GraphQL - Delete Post
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { deletePost(id: \"1\") }"
  }'
```

### GraphQL - Get Feed
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { feed { id content image user { username } createdAt likeCount commentCount } }"
  }'
```

### GraphQL - Search Posts
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { posts(search: \"test\") { id content user { username } createdAt } }"
  }'
```

## 💬 Comment Management Endpoints

### REST - Create Comment
```bash
curl -X POST $REST_BASE_URL/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "content": "This is a great post!"
  }'
```

### REST - Get Post Comments
```bash
curl -X GET $REST_BASE_URL/comments/post/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Update Comment
```bash
curl -X PUT $REST_BASE_URL/comments/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment content"
  }'
```

### REST - Delete Comment
```bash
curl -X DELETE $REST_BASE_URL/comments/1 \
  -H "Authorization: Bearer $TOKEN"
```

### GraphQL - Create Comment
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { commentPost(postId: \"1\", content: \"GraphQL comment!\") { id content user { username } post { id } createdAt } }"
  }'
```

### GraphQL - Get Post Comments
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { comments(postId: \"1\") { id content user { username } createdAt } }"
  }'
```

### GraphQL - Update Comment
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { updateComment(id: \"1\", content: \"Updated via GraphQL\") { id content updatedAt } }"
  }'
```

### GraphQL - Delete Comment
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { deleteComment(id: \"1\") }"
  }'
```

## ❤️ Like Management Endpoints

### REST - Like Post
```bash
curl -X POST $REST_BASE_URL/likes/post/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Unlike Post
```bash
curl -X DELETE $REST_BASE_URL/likes/post/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Get Post Likes
```bash
curl -X GET $REST_BASE_URL/likes/post/1 \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Get User Likes
```bash
curl -X GET $REST_BASE_URL/likes/user/1 \
  -H "Authorization: Bearer $TOKEN"
```

### GraphQL - Like Post (Handles Conflicts)
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { likePost(postId: \"1\") { id post { id content } user { id username } createdAt } }"
  }'
```

### GraphQL - Unlike Post
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { unlikePost(postId: \"1\") }"
  }'
```

### GraphQL - Get Post Likes
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { likes(postId: \"1\") { id user { username } createdAt } }"
  }'
```

## 👥 Follow Management Endpoints

### REST - Follow User
```bash
curl -X POST $REST_BASE_URL/users/1/follow \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Unfollow User
```bash
curl -X DELETE $REST_BASE_URL/users/1/follow \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Get User Followers
```bash
curl -X GET $REST_BASE_URL/users/1/followers \
  -H "Authorization: Bearer $TOKEN"
```

### REST - Get User Following
```bash
curl -X GET $REST_BASE_URL/users/1/following \
  -H "Authorization: Bearer $TOKEN"
```

### GraphQL - Follow User (Handles Conflicts)
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { followUser(userId: \"1\") { id follower { id username } following { id username } createdAt } }"
  }'
```

### GraphQL - Unfollow User
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { unfollowUser(userId: \"1\") }"
  }'
```

### GraphQL - Get User Followers
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { followers(userId: \"1\") { id username email full_name } }"
  }'
```

### GraphQL - Get User Following
```bash
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { following(userId: \"1\") { id username email full_name } }"
  }'
```

## 🧪 Testing Flow Example

Here's a complete testing flow to verify all functionality:

```bash
# 1. Register a new user
curl -X POST $REST_BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testflow",
    "email": "testflow@example.com", 
    "password": "password123",
    "full_name": "Test Flow User"
  }'

# 2. Login and get token
RESPONSE=$(curl -s -X POST $REST_BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testflow@example.com",
    "password": "password123"
  }')

# Extract token (requires jq)
TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# 3. Create a post
curl -X POST $REST_BASE_URL/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "My first test post!",
    "commentsEnabled": true
  }'

# 4. Like the post (via GraphQL)
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { likePost(postId: \"1\") { id post { content } user { username } } }"
  }'

# 5. Follow another user (via GraphQL)
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { followUser(userId: \"1\") { id follower { username } following { username } } }"
  }'

# 6. Get updated profile
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query { me { id username followersCount followingCount } }"
  }'
```

## 🔍 Important Notes

### Authentication
- All endpoints except register/login require `Authorization: Bearer <token>` header
- Tokens expire after 24 hours (configurable in JWT_SECRET)

### GraphQL Advantages
- **Conflict Handling**: `likePost` and `followUser` mutations handle duplicate operations gracefully
- **Single Endpoint**: All operations through `/graphql`
- **Flexible Queries**: Request only the fields you need

### REST vs GraphQL
- Both use the same underlying business logic (shared models)
- GraphQL provides better error handling for conflicts
- REST follows traditional HTTP status codes
- Choose based on your client needs

### Error Handling
- GraphQL returns structured errors in the `errors` array
- REST returns appropriate HTTP status codes
- Both include descriptive error messages

### Rate Limiting
- Not implemented yet - consider adding for production
- Database connections are pooled for performance

### Production Checklist
- [ ] Change JWT_SECRET in production
- [ ] Add rate limiting
- [ ] Add input validation/sanitization  
- [ ] Add logging middleware
- [ ] Add CORS configuration
- [ ] Add HTTPS termination
- [ ] Add database connection pooling limits
