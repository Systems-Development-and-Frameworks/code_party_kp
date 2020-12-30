import jwt from "jsonwebtoken";

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function issueToken(id) {
  const signOptions = {
    expiresIn: "3h",
  };
  return jwt.sign({ id: id }, process.env.JWT_SECRET, signOptions);
}
