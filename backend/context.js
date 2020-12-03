import { verifyToken } from "./services/jwt.js";
export function context({ req }) {
  if (!req) return {};
  let token = req.headers.authorization || "";
  token = token.replace("Bearer ", "");
  try {
    const decodedJWT = verifyToken(token);
    return { decodedJWT };
  } catch (e) {
    return {};
  }
}
