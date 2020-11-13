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
    voters: [User]
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
  Mutation: {
    write: (parent, _args, {dataSources}) =>
    {
      return dataSources.memoryDataSource.addnewPost( _args.post.title, _args.post.author);
    },
    upvote: (parent, _args, {dataSources}) =>
    {
      return dataSources.memoryDataSource.upvote(_args.id, _args.voter);
    }
  }
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

    this.addnewPost(
       "Pinguine sind keine Vögel",
      { name: "Peter" },);
  }

  initialize() {}

  addnewPost(_title, _author) {
    let post = {
      id: this.postsData.length,
      title: _title,
      votes: 0 /*TODO or empty set */,
      author: _author,
      voters : [{name: "a"}]
    };
    
    //it's a set, doesn't matter if exists or not
    this.usersData.add(_author);

    //posts can have duplicate content, as long as id's are different, so no checks needed
    this.postsData.push(post);
    return post;
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
  async upvote(id, voter) {
    let postIndex = this.postsData.findIndex((x) => x.id == id);
    if(postIndex != -1)
    {
      if(this.postsData[postIndex].voters == null)
      {
        this.postsData[postIndex].voters = [];
      }
      else if(this.postsData[postIndex].voters.findIndex((x)=> x.name == voter.name) != -1) 
      {
        return this.postsData[postIndex];
      }
      this.postsData[postIndex].voters.push(voter);
      this.postsData[postIndex].votes++;
    }
    return this.postsData[postIndex];
  }
  // async upvote(id, voter) {
  //   let post = this.postsData.find((x) => x.id == id);
  //   if(post != undefined)
  //   {
  //     if(post.voters == null)
  //     {
  //       post.voters = [];
  //     }
  //     else if(post.voters.find((x)=> x.name == voter.name) != undefined) 
  //     {
  //       return post;
  //     }
  //     post.voters.push(voter);
  //     post.votes++;
  //   }
  //   return post;
  // }
}
