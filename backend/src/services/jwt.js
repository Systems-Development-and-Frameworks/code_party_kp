import jwt from "jsonwebtoken";
import * as dotenvFlow from "dotenv-flow";

dotenvFlow.config();

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function issueToken(id) {
  var signOptions = {
    expiresIn: "3h",
  };
  return jwt.sign({ id: id }, process.env.JWT_SECRET, signOptions);
}
