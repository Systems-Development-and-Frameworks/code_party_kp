export const queryResolver = {
  Query: {
    users: async (_parent, _args, context) => {
      return context.dataSources.db.users();
    },
    posts: async (_parent, _args, context) => {
      return context.dataSources.db.posts();
    },
  },
  User: {
    posts: async (parent, _args, context) => {
      return context.dataSources.db.getPosts(parent.id);
    },
  },
};
