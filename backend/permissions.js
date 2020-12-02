// Rules
import { rule, shield, and, or, not } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, { dataSources }, info) => {
    return dataSources.db.user !== null;
  }
);

export const permissions = shield({
  Mutation: {
    upvote: isAuthenticated,
    write: isAuthenticated,
  },
});
