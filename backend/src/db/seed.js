import neode from "./neode";
import User from "./entities/User";
import Post from "./entities/Post";

const seed = async () => {
  let peter = new User({
    name: "Peter",
    email: "peter@widerstand-der-pinguin.ev",
    password: "hashed",
    id: "1",
  });
  let brother = new User({
    name: "Peter's Bruder",
    email: "augustus@coalition-der-waschbaere.ev",
    password: "hashed",
    id: "2",
  });

  await Promise.all([peter, brother].map((p) => p.save()));

  const posts = [
    new Post({
      title: "Pinguine sind keine Vögel",
      author: peter,
      id: "11",
    }),
  ];
  await Promise.all(posts.map((post) => post.save()));
};

(async () => {
  await seed();
  await neode.driver.close();
})();
