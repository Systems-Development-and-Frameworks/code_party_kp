import { makeAugmentedSchema } from "neo4j-graphql-js";
import { gql } from "apollo-server";
const typeDefs = gql`
  type User {
    # ⚠️ attributes 'id' and 'name' have changed!
    # 'id' now represents a randomly generated string, similar to 'Post.id'
    id: ID!
    name: String!
    email: String!
    posts: [Post] @relation(name: "WROTE", direction: "OUT")
  }

  type Post {
    id: ID!
    title: String!
    author: User! @relation(name: "WROTE", direction: "IN")
    voters: [User] @relation(name: "UPVOTED_BY", direction: "OUT")
  }
`;
const schema = makeAugmentedSchema({
  typeDefs,
  config: { query: false, mutation: false },
});
export default schema;
