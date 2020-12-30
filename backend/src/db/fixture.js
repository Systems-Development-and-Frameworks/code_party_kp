import User from "./entities/User";
import Post from "./entities/Post";

const peter = new User({
  name: "Peter",
  email: "peter@widerstand-der-pinguin.ev",
  id: "b5bc19f4-164e-49c3-8045-7105580b43be",
});

const petersPassword = "peter1";

const brother = new User({
  name: "Peter's Bruder",
  email: "augustus@coalition-der-waschbaere.ev",
  id: "e8d085c6-9d3b-4762-8f71-12dc28bb45c7",
});

const brothersPassword = "brother1";

const petersPost = new Post({
  title: "Pinguine sind keine Vögel",
  author: peter,
  id: "613e8596-b432-4b74-89d4-06709644d8ee",
});

export default { peter, brother, petersPassword, brothersPassword, petersPost };
