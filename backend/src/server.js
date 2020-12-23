import { ApolloServer } from "apollo-server";
import typeDefs from "./typeDefs.js";
import { MemoryDataSource } from "./db.js";
import { permissions } from "./permissions.js";
import { context } from "./context.js";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";
import { mergeResolvers } from "@graphql-tools/merge";
import { postsMutationResolver } from "./resolvers/mutations_post";
import { usersMutationResolver } from "./resolvers/user_mutations";
import { queryResolver } from "./resolvers/query_all";
import { stitchSchemas } from '@graphql-tools/stitch';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
const neo4jSchema = makeAugmentedSchema({typeDefs});

//const db = new MemoryDataSource();
//const dataSources = () => ({ db });

//load all resolvers and combine them
const resolvers = mergeResolvers([
  postsMutationResolver,
  usersMutationResolver,
  queryResolver,
]);

//combine into executable schema
//const schema = makeExecutableSchema({ typeDefs, resolvers });

const schema = stitchSchemas({
  subschemas: [neo4jSchema],
  typeDefs,
  resolvers
  });

//enrichen with middleware
//const schemaWithMiddleWare = applyMiddleware(schema, permissions);

//create an instance of Apollo Server
export default class Server {
  constructor(opts) {
    const defaults = {
      schema: schema,
      context
    };
    return new ApolloServer({ ...defaults, ...opts });
  }
}
