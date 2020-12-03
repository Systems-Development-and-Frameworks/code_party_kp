// Rules
import { rule, shield, allow } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, { dataSources }, info) => {
    //TODO
    return true;
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
