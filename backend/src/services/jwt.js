import jwt from "jsonwebtoken";

require("dotenv-flow").config();

export function verifyToken(token) {
  var verifyOptions = {
    expiresIn: "3h",
  };
  return jwt.verify(token, process.env.JWT_SECRET, verifyOptions);
}

export function issueToken(id) {
  var signOptions = {
    expiresIn: "3h",
  };
  return jwt.sign({ id: id }, process.env.JWT_SECRET, signOptions);
}
