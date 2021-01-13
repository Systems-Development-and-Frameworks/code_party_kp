import neode from "./neode";
import fixture from "./fixture.js";

export async function seedUsers() {
  await Promise.all([
    fixture.peter.save(fixture.petersPassword),
    fixture.brother.save(fixture.brothersPassword),
  ]);
}

export async function seedPosts() {
  const posts = [fixture.petersPost];
  await Promise.all(posts.map((post) => post.save()));
}

export async function seed() {
  await seedUsers();
  await seedPosts();
}

export async function close() {
  await neode.driver.close();
}

export async function clean() {
  await neode.driver
    .session()
    .writeTransaction((txc) => txc.run("MATCH(n) DETACH DELETE n;"));
}
