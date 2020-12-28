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
    votes: Int!
    author: User! @relation(name: "WROTE", direction: "IN")
  }
`;
const schema = makeAugmentedSchema({ typeDefs });
export default schema;
