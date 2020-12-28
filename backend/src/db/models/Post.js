module.exports = {
  id: {
    type: "uuid",
    primary: true,
  },
  title: {
    type: "string",
    required: true,
  },
  votes: {
    type: "integer",
    required: true,
  },
  author: {
    type: "relationship",
    target: "User",
    relationship: "WROTE",
    direction: "in",
  },
};
