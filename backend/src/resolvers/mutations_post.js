export const postsMutationResolver = {
  Mutation: {
    write: async (parent, args, context) => {
      let user = await context.dataSources.db.getUserById(context.id);
      return await context.dataSources.db.addNewPost({
        ...args.post,
        author: user,
      });
    },
    upvote: async (parent, args, context) => {
      let user = await context.dataSources.db.getUserById(context.id);
      return context.dataSources.db.upvote(args.id, user);
    },
  },
};
