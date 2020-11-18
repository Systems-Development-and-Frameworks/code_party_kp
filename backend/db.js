import { DataSource } from 'apollo-datasource'
import crypto from 'crypto'

export class User{
    constructor (data){
       Object.assign(this,data)
    }
}
export class Post {
  constructor (data) {
    this.id = crypto.randomBytes(16).toString('hex')
    this.votes = 0
    this.author = new User(data.author)
    this.voters = new Set()
    Object.assign(this, data)
  }
}

export class MemoryDataSource extends DataSource {
    constructor() {
      super();
  
      this.usersData = new Set();
      this.postsData = [];
    }
  
    initialize() {}
  
    addnewPost(postInput) {
      let post = new Post(postInput);
      
      //it's a set, doesn't matter if exists or not
      this.usersData.add(postInput.author);
  
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
        const currentPost =  this.postsData[postIndex];
        currentPost.voters.add(voter.name);
        currentPost.votes = currentPost.voters.size;
        return currentPost;
      }
      return undefined;
    }
  }