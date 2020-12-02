import { ApolloServer } from "apollo-server";
import typeDefs from "./typeDefs.js";
import { MemoryDataSource } from "./db.js";
import { permissions } from "./permissions.js";

import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";

import jwt from "jsonwebtoken";

//TODO fix me
const JWT_SECRET = "MY_JWT_SECRET";

const db = new MemoryDataSource();
db.addnewPost({
  title: "Pinguine sind keine Vögel",
  author: { name: "Peter", email: "peter@gmail.com" },
});

const dataSources = () => ({ db });

export function context({ req }) {
  let token = req?.headers?.authorization ?? "";
  token = token.replace("Bearer ", "");
  try {
    const decodedJWT = jwt.verify(token, JWT_SECRET);
    return { decodedJWT };
  } catch (e) {
    return {};
  }
}
//const context = ({ req, res }) => ({ req, res });
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
      return context.dataSources.db.getPosts(parent.id);
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

//const schema = applyMiddleware(typeDefs, permissions);
const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleWare = applyMiddleware(schema, permissions);
export default class Server {
  constructor(opts) {
    const defaults = {
      schema: schemaWithMiddleWare,
      dataSources,
      context,
    };
    return new ApolloServer({ ...defaults, ...opts });
  }
}
