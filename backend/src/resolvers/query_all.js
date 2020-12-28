import { neo4jgraphql } from "neo4j-graphql-js";

export default () => ({
  Query: {
    users: async (_parent, _args, context, resolveInfo) => {
    
      return neo4jgraphql(_parent, _args, context, resolveInfo);
    },
    posts: async (_parent, _args, context,resolveInfo) => {
    
      return neo4jgraphql(_parent, _args, context, resolveInfo);
    },
  },
  
  //TODO not tested yet
  Post: {
    votes: {
      selectionSet: "{ voters { id } }",
      resolve: (post) => post.voters.length,
    },
  },
});
