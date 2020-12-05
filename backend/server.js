import { ApolloServer } from "apollo-server";
import typeDefs from "./typeDefs.js";
import { MemoryDataSource } from "./db.js";
import { permissions } from "./permissions.js";
import { verifyToken } from "./services/jwt.js";
const path = require("path");

import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema, mergeResolvers } from "graphql-tools";
import { postsMutationResolver } from "./resolvers/mutations_post";
import { usersMutationResolver } from "./resolvers/user_mutations";
import { queryResolver } from "./resolvers/query_all";
const db = new MemoryDataSource();
//add some dummy data
db.addnewPost({
  title: "Pinguine sind keine Vögel",
  author: { name: "Peter", email: "peter@gmail.com" },
});

const dataSources = () => ({ db });

export function context({ req }) {
  let token = req?.headers?.authorization ?? "";
  token = token.replace("Bearer ", "");
  try {
    const decodedJWT = verifyToken(token);
    return { decodedJWT };
  } catch (e) {
    return {};
  }
}

//load all resolvers from dir
//combine them
const resolvers = mergeResolvers([
  postsMutationResolver,
  usersMutationResolver,
  queryResolver,
]);
//combine into executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });
//enrichen with middleware
const schemaWithMiddleWare = applyMiddleware(schema, permissions);

//create an instance of Apollo Server
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
