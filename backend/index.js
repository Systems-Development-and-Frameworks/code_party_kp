const { ApolloServer, gql } = require("apollo-server");

/* 
-- 1)
User: {ID, Posts.find(post.author =- user.id)}
Posts:[ID,Author]

*/
// example from https://www.apollographql.com/docs/apollo-server/getting-started/

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    votes: Int!
    author: User!
  }

  type User {
    name: ID!
    posts: [Post]
  }

  type Query {
    posts: [Post]
    users: [User]
  }

  type Mutation {
    write(post: PostInput!): Post
    # 🚀 OPTIONAL
    # delete(id: ID!): Post

    # ⚠️ FIXME in exercise #4
    # mock voter until we have authentication
    upvote(id: ID!, voter: UserInput!): Post

    # 🚀 OPTIONAL
    # downvote(id: ID!, voter: UserInput!): Post
  }

  input PostInput {
    title: String!

    # ⚠️ FIXME in exercise #4
    # mock author until we have authentication
    author: UserInput!
  }

  input UserInput {
    name: String!
  }
`;

//5. define resolver
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    users: async (_parent, _args, { dataSources }) => {
      return dataSources.memoryDataSource.users();
    },
    posts: async (_parent, _args, { dataSources }) => {
      return dataSources.memoryDataSource.posts();
    },
  },
  User: {
    posts: async (parent, _args, { dataSources }) => {
      return dataSources.memoryDataSource.getPosts(parent.name);
    },
  },
};

//6. create an instance of Apollo Server
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ memoryDataSource: new MemoryDataSource() }),
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

const { DataSource } = require("apollo-datasource");

class MemoryDataSource extends DataSource {
  //TODO  constructor injection

  constructor() {
    super();

    this.usersData = new Set();
    this.postsData = [];

    this.newPost({
      title: "Pinguine sind keine Vögel",
      author: { name: "Peter" },
    });
  }

  initialize() {}

  newPost({ title, author }) {
    let post = {
      id: "TODO GENERATE",
      title: title,
      votes: 0 /*TODO or empty set */,
      author: author,
    };
    //it's a set, doesn't matter if exists or not
    this.usersData.add(author);

    //posts can have duplicate content, as long as id's are different, so no checks needed
    this.postsData.push(post);
  }

  async posts() {
    return this.postsData;
  }
  async getPosts(id) {
    return this.postsData.filter((x) => x.author.name == id);
  }

  async users() {
    return this.usersData;
  }
}
