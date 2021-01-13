import { verifyToken } from "./services/jwt.js";
import driver from "./driver";

export function context({ req }) {
  if (!req) return { driver };
  let token = req.headers.authorization || "";
  token = token.replace("Bearer ", "");
  try {
    const decodedJWT = verifyToken(token);
    return { decodedJWT, driver };
  } catch (e) {
    return { driver };
  }
}
