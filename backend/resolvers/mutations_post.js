export const postsMutationResolver = {
  Mutation: {
    write: (parent, _args, context) => {
      return context.dataSources.db.addnewPost(_args.post);
    },
    upvote: (parent, _args, context) => {
      //TODO voter from context
      return context.dataSources.db.upvote(_args.id, _args.voter);
    },
  },
};
