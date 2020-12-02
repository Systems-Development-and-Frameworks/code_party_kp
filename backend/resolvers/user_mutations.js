export const usersMutationResolver = {
  Mutation: {
    //TODO implement

    write: (parent, _args, context) => {
      return context.dataSources.db.addnewPost(_args.post);
    },
    upvote: (parent, _args, context) => {
      return context.dataSources.db.upvote(_args.id, _args.voter);
    },
  },
};
