import { rule, shield, allow } from "graphql-shield";

import User from "./db/entities/User";

const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { id }) => {
    let exists = await User.exists({ id });
    return exists;
  }
);

export const permissions = shield(
  {
    Query: {
      "*": allow,
    },

    Mutation: {
      "*": allow,
      upvote: isAuthenticated,
      write: isAuthenticated,
    },
  },
  { allowExternalErrors: true }
);
