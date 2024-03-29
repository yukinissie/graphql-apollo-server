const { ApolloServer, gql } = require("apollo-server");
const { RESTDataSource } = require("apollo-datasource-rest");
const { PrismaClient } = require("@prisma/client");

class jsonPlaceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://jsonplaceholder.typicode.com/";
  }

  async getUsers() {
    const data = await this.get("/users");
    return data;
  }
  async getUser(id) {
    const data = await this.get(`/users/${id}`);
    return data;
  }
  async getPosts() {
    const data = await this.get("/posts");
    return data;
  }
}

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

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String!): User
    deleteUser(id: Int!): User
  }
`;

const resolvers = {
  Query: {
    hello: (_, args) => `Hello, ${args.name}!`,
    users: async (_, __, { dataSources }) => {
      return dataSources.sqlite.user.findMany();
    },
    user: async (_, args, { dataSources }) => {
      return dataSources.sqlite.user.findUnique({
        where: {
          id: parseInt(args.id),
        },
      });
    },
    posts: async (_, __, { dataSources }) => {
      return dataSources.sqlite.post.findMany();
    },
  },
  Mutation: {
    createUser: (_, args, { dataSources }) => {
      return dataSources.sqlite.user.create({
        data: {
          name: args.name,
          email: args.email,
        },
      });
    },
    updateUser: (_, args, { dataSources }) => {
      return dataSources.sqlite.user.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.name,
        },
      });
    },
    deleteUser: (_, args, { dataSources }) => {
      return dataSources.sqlite.user.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
  User: {
    myPosts: async (parent, __, { dataSources }) => {
      return dataSources.sqlite.post.findMany({
        where: {
          userId: parent.id,
        },
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      jsonPlaceAPI: new jsonPlaceAPI(),
      sqlite: new PrismaClient(),
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
