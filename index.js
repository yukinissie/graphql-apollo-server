const { ApolloServer, gql } = require("apollo-server");

const users = [
  { id: "1", name: "John Doe", email: "john@test.com" },
  { id: "2", name: "Jane Doe", email: "jane@example.com" },
];

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello(name: String!): String
    users: [User]
    user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args) => `Hello, ${args.name}!`,
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
