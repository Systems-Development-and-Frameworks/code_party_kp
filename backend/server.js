import { ApolloServer } from "apollo-server";
import typeDefs from "./typeDefs.js";
import { MemoryDataSource, Post, User } from "./db.js";

const db = new MemoryDataSource();
db.addnewPost({
  title: "Pinguine sind keine Vögel",
  author: { name: "Peter" },
});

const dataSources = () => ({ db });

const context = ({ req, res }) => ({ req, res });
//5. define resolver
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    users: async (_parent, _args, context) => {
      return context.dataSources.db.users();
    },
    posts: async (_parent, _args, context) => {
      return context.dataSources.db.posts();
    },
  },
  User: {
    posts: async (parent, _args, context) => {
      return context.dataSources.db.getPosts(parent.name);
    },
  },
  Mutation: {
    write: (parent, _args, context) => {
      return context.dataSources.db.addnewPost(_args.post);
    },
    upvote: (parent, _args, context) => {
      return context.dataSources.db.upvote(_args.id, _args.voter);
    },
  },
};

//6. create an instance of Apollo Server
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
export default class Server {
  constructor(opts) {
    const defaults = {
      typeDefs,
      resolvers,
      dataSources,
      context,
    };
    return new ApolloServer({ ...defaults, ...opts });
  }
}
