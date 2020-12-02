import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";

// loading .env file
dotenv.config();

export function verifyToken(token) {
  var verifyOptions = {
    expiresIn: "3h",
  };
  jwt.verify(token, process.env.JWT_SECRET, verifyOptions);
}

export function issueToken(id) {
  var signOptions = {
    expiresIn: "3h",
  };
  return jsonwebtoken.sign({ id: id }, process.env.JWT_SECRET, signOptions);
}
