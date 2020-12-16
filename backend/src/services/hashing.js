import bcrypt from "bcrypt";

export function compare(plaintext, storedHash) {
  return bcrypt.compare(plaintext, storedHash);
}
export function hash(plaintext) {
  return bcrypt.hash(plaintext, 10);
}
