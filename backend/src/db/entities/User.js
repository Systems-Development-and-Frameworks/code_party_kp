import crypto from "crypto";
import neode from "../neode";
const hashing = require("../../services/hashing.js");

export default class User {
  constructor(data) {
    //TODO @Here can we still use it?
    this.id = crypto.randomBytes(16).toString("hex");
    Object.assign(this, data);
  }
  async checkPassword(password) {
    return await hashing.compare(password, this.password);
  }

  async save(password) {
    let encryptedPassword = await hashing.hash(password);
    this.password = encryptedPassword;
    const node = await neode.create("User", this);
    Object.assign(this, { ...node.properties(), node });
    return this;
  }
  static async first(props) {
    const node = await neode.first("User", props);
    if (!node) return null;
    return new User({ ...node.properties(), node });
  }

  static async exists(props) {
    return !!(await this.first(props));
  }

  static async all() {
    const nodes = await neode.all("User");
    return nodes.map((node) => new User({ ...node.properties(), node }));
  }
}
