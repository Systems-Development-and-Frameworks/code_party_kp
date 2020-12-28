import jwt from "jsonwebtoken";
import * as dotenvFlow from "dotenv-flow";

export function verifyToken(token) {
  //TODO @Here might need to import from config
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function issueToken(id) {
  const signOptions = {
    expiresIn: "3h",
  };
  //TODO @Here might need to import from config
  return jwt.sign({ id: id }, process.env.JWT_SECRET, signOptions);
}
