import { rule, shield, allow, deny } from "graphql-shield";

import User from "./db/entities/User";

const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { id }) => {
    let exists = await User.exists({ id });
    return exists;
  }
);

export const permissions = shield(
  {
    User: allow,
    Post: allow,

    Query: {
      users: allow,
      posts: allow,
      Post: allow,
      User: allow,
    },

    Mutation: {
      login: allow,
      signup: allow,
      upvote: isAuthenticated,
      write: isAuthenticated,
    },
  },
  {
    allowExternalErrors: true,
    fallbackRule: deny,
  }
);
