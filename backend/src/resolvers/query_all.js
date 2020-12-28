import { neo4jgraphql } from "neo4j-graphql-js";

export default ({ subschema }) => ({
  Query: {
    users: async (_parent, _args, context, resolveInfo) => {
      //return context.dataSources.db.users();
      return neo4jgraphql(_parent, _args, context, resolveInfo);
    },
    posts: async (_parent, _args, context) => {
      //TODO make it in neo4jgraphql
      return context.dataSources.db.posts();
    },
  },
  User: {
    posts: async (parent, _args, context) => {
      //TODO make it in neo4jgraphql
      return context.dataSources.db.getPosts(parent.id);
    },
  },
});
