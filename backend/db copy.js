import { DataSource } from "apollo-datasource";
import { AuthenticationError, UserInputError } from "apollo-server";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

// loading .env file
dotenv.config();

export class User {
  constructor(data) {
    this.id = crypto.randomBytes(16).toString("hex"); //TODO: another way?
    Object.assign(this, data);
  }
}
export class Post {
  constructor(data) {
    this.id = crypto.randomBytes(16).toString("hex"); //TODO: another way?
    this.votes = 0;
    let a = new User(data.author);
    delete data.author;
    data.author = a; /////////////!! Problem
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

  async addnewPost(postInput) {
    let post = await new Post(postInput);

    //it's a set, doesn't matter if exists or not
    this.usersData.add(post.author);
    //posts can have duplicate content, as long as id's are different, so no checks needed
    this.postsData.push(post);
    return post;
  }
  isPwStrong(password) {
    return password.length > 7;
  }

  isEMailExists(email) {
    return this.users.find((user) => user.email === email);
  }

  async signUp({ name, email, password }) {
    if (this.isEMailExists(email)) {
      throw new UserInputError("Email exists already!");
    }
    if (!this.isPwStrong(password)) {
      throw new UserInputError(
        "The passwort has to include more than 7 characters!"
      );
    }
    const user = await new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    this.users.push(user);
    return jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET);
  }

  async loginHelper({ email, password }) {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new UserInputError("There is no user registered with this EMail!");
    }

    const validate = await bcrypt.compare(password, user.password);
    if (!validate) {
      throw new AuthenticationError("Passwort is not correct!");
    }
    return jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET);
  }

  async posts() {
    return this.postsData;
  }
  async getPosts(id) {
    return this.postsData.filter((x) => x.author.id == id);
  }

  async users() {
    return this.usersData;
  }
  // async upvote(id, voter) {
  //   let postIndex = this.postsData.findIndex((x) => x.id == id);
  //   if (postIndex != -1) {
  //     const currentPost = this.postsData[postIndex];
  //     currentPost.voters.add(voter.name);
  //     currentPost.votes = currentPost.voters.size;
  //     return currentPost;
  //   }
  //   return undefined;
  // }
  async upvote(id /*=post id */) {
    return this.postsData.find((x) => x.id == id);
  }
}
