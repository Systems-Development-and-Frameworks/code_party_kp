import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";

// loading .env file
dotenv.config();

export function verifyToken(token) {
  jwt.verify(token, process.env.JWT_SECRET);
}

export function issueToken(id) {
  return jsonwebtoken.sign({ id: id }, process.env.JWT_SECRET);
}
