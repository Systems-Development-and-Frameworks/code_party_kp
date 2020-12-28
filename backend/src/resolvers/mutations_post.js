export default ({ subschema }) => ({
  Mutation: {
    write: async (parent, args, context) => {
      let user = await context.dataSources.db.getUserById(context.id);
      //TODO make it in neo4jgraphql
      return await context.dataSources.db.addNewPost({
        ...args.post,
        author: user,
      });
    },
    upvote: async (parent, args, context) => {
      let user = await context.dataSources.db.getUserById(context.id);
      //TODO make it in neo4jgraphql
      return context.dataSources.db.upvote(args.id, user);
    },
  },
});
