const { ApolloServer, gql } = require("apollo-server");
const { default: axios } = require("axios");
const { assertWrappingType } = require("graphql");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    myPosts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
  }

  type Query {
    hello(name: String!): String
    users: [User]
    user(id: ID!): User
    posts: [Post]
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args) => `Hello, ${args.name}!`,
    users: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      return res.data;
    },
    user: async (parent, args) => {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${args.id}`
      );
      return res.data;
    },
    posts: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      return res.data;
    },
  },
  User: {
    myPosts: async (parent) => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      const myPosts = res.data.filter((post) => post.userId == parent.id);
      return myPosts;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
