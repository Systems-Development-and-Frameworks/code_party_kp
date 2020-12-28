import { neo4jgraphql } from "neo4j-graphql-js";

export default () => ({
  Query: {
    users: async (parent, args, context, resolveInfo) => {
      return neo4jgraphql(parent, args, context, resolveInfo);
    },
    posts: async (parent, args, context, resolveInfo) => {
      return neo4jgraphql(parent, args, context, resolveInfo);
    },
  },

  //TODO not tested yet
  Post: {
    votes: {
      selectionSet: "{ voters { id } }",
      resolve: (post) => post.voters?.length ?? 0,
    },
  },
});
