import { DataSource } from "apollo-datasource";
import crypto from "crypto";

export class User {
  constructor(data) {
    this.id = crypto.randomBytes(16).toString("hex");
    Object.assign(this, data);
  }
}
export class Post {
  constructor(data) {
    this.id = crypto.randomBytes(16).toString("hex");
    this.votes = 0;
    this.voters = new Set();
    Object.assign(this, data);
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
    //TODO author here
    let post = new Post(postInput);

    //posts can have duplicate content, as long as id's are different, so no checks needed
    this.postsData.push(post);
    return post;
  }

  async posts() {
    return this.postsData;
  }
  async getPosts(id) {
    return this.postsData.filter((x) => x.author.id == id);
  }

  async getUser(id) {
    return this.usersData.filter((x) => x.id == id);
  }

  async users() {
    return this.usersData;
  }

  async upvote(id, voter) {
    let postIndex = this.postsData.findIndex((x) => x.id == id);
    if (postIndex != -1) {
      const currentPost = this.postsData[postIndex];
      currentPost.voters.add(voter.id);
      currentPost.votes = currentPost.voters.size;
      return currentPost;
    }
    return undefined;
  }
}
