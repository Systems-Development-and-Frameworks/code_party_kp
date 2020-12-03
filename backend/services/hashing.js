import bcrypt from "bcrypt";

export async function compare(plaintext, storedHash) {
  return await bcrypt.compare(plaintext, storedHash);
}
export async function hash(plaintext) {
  return await bcrypt.hash(plaintext, 10);
}
