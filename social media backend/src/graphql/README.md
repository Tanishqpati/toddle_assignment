# GraphQL API Implementation

This folder contains the GraphQL implementation for the social media backend. The code is split into:
- `typeDefs.js`: GraphQL schema definitions
- `resolvers.js`: Query and mutation resolvers
- `server.js`: Apollo Server setup and Express integration

## Usage
Run the GraphQL server with:

```
node src/graphql/server.js
```

## Features
All REST API features are available via GraphQL:
- User registration, login, profile update
- Post CRUD, scheduled posting
- Like/unlike, comment CRUD
- Follow/unfollow, followers/following
- Feed, search, counts

## Authentication
Pass JWT token in the `Authorization` header as `Bearer <token>` for authenticated operations.
