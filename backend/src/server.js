import { ApolloServer } from "apollo-server";
import typeDefs from "./typeDefs.js";

import { permissions } from "./permissions.js";
import { context } from "./context.js";
import { applyMiddleware } from "graphql-middleware";
import { mergeResolvers } from "@graphql-tools/merge";
import postsMutationResolver from "./resolvers/mutate_posts";
import usersMutationResolver from "./resolvers/mutate_users";
import queryResolver from "./resolvers/query";
import { stitchSchemas } from "@graphql-tools/stitch";

import neo4jSchema from "./neo4j-graphql-js/schema";

//load all resolvers and combine them
const resolvers = mergeResolvers([
  postsMutationResolver({ subschema: neo4jSchema }),
  usersMutationResolver({ subschema: neo4jSchema }),
  queryResolver({ subschema: neo4jSchema }),
]);

const schema = stitchSchemas({
  subschemas: [neo4jSchema],
  typeDefs,
  resolvers,
});

//enrichen with middleware
const schemaWithMiddleWare = applyMiddleware(schema, permissions);

//create an instance of Apollo Server
export default class Server {
  constructor(opts) {
    const defaults = {
      schema: schemaWithMiddleWare,
      context,
    };
    return new ApolloServer({ ...defaults, ...opts });
  }
}
