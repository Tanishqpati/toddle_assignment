const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const jwtUtils = require("../utils/jwt");

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "") || "";
    let user = null;
    if (token) {
      try {
        user = jwtUtils.verifyToken(token);
      } catch (err) {
        user = null;
      }
    }
    return { user };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
