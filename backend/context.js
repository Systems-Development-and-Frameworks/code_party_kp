import { verifyToken } from "./services/jwt.js";
export default function context({ req }) {
  let token = req.headers.authorization ?? "";
  token = token.replace("Bearer ", "");
  try {
    const decodedJWT = verifyToken(token);
    return { decodedJWT };
  } catch (e) {
    return {};
  }
}
