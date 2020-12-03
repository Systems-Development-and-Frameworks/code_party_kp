// Rules
import { rule, shield, allow } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { dataSources, id }) => {
    let exists = dataSources.db.userExists(id);
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
