import neode from "../neode";
import crypto from "crypto";

export default class Post {
  constructor(data) {
    this.id = crypto.randomBytes(16).toString("hex");
    this.voters = new Set();
    Object.assign(this, data);
  }
  get votes() {
    return this.voters.size;
  }

  async save() {
    if (!(this.author && this.author.node))
      throw new Error("author node is missing!");
    const node = await neode.create("Post", this);
    await node.relateTo(this.author.node, "author");
    Object.assign(this, { ...node.properties(), node });
    return this;
  }

  static async first(props) {
    const node = await neode.first("Post", props);
    if (!node) return null;
    return new Post({ ...node.properties(), node });
  }

  /*
    C)  let post = Posts.first({id:id})
        post.upvote(voter)
    */
  async upvote(voter) {
    if (!(voter && voter.node)) throw new Error("voter node is missing!");
    await this.node.relateTo(voter.node, "upvoted");
  }

  static async all() {
    const nodes = await neode.all("Post");
    return nodes.map((node) => new Post({ ...node.properties(), node }));
  }
}
