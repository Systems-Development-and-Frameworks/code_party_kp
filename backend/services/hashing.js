import bcrypt from "bcrypt";

export async function compare(hash1, hash2) {
  await bcrypt.compare(hash1, hash2);
}
export async function hash(password) {
  await bcrypt.hash(password, 10);
}
