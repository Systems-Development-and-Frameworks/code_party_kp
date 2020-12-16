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
    this.voters = new Set();
    Object.assign(this, data);
  }
  get votes(){
    return this.voters.size;
  }
}

export class MemoryDataSource extends DataSource {
  constructor() {
    super();

    this.usersData = [];
    this.postsData = [];
  }

  initialize() {}

  async addNewPost(postInput) {
    let post = new Post(postInput);
    //posts can have duplicate content, as long as id's are different, so no checks needed
    this.postsData.push(post);
    return post;
  }

  async addNewUser(userInput) {
    let user = new User(userInput);
    this.usersData.push(user);
    return user;
  }

  async posts() {
    return this.postsData;
  }

  async getPosts(id) {
    return this.postsData.filter((x) => x.author.id == id);
  }

  async emailExists(email) {
    return !!(await this.getUserByEmail(email));
  }

  async getUserByEmail(email) {
    return this.usersData.find((x) => x.email == email);
  }

  async userExists(id) {
    return !!(await this.getUserById(id));
  }

  async getUserById(id) {
    return this.usersData.find((x) => x.id == id);
  }

  async users() {
    return this.usersData;
  }

  async upvote(id, voter) {
    let postIndex = this.postsData.findIndex((x) => x.id == id);
    if (postIndex != -1) {
      const currentPost = this.postsData[postIndex];
      currentPost.voters.add(voter.id);
      return currentPost;
    }
    return undefined;
  }
}
