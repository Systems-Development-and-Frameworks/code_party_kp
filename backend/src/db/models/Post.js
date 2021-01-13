module.exports = {
  id: {
    type: "uuid",
    primary: true,
  },
  title: {
    type: "string",
    required: true,
  },

  author: {
    type: "relationship",
    target: "User",
    relationship: "WROTE",
    direction: "in",
  },

  voters: {
    type: "relationship",
    target: "User",
    relationship: "UPVOTED_BY",
    direction: "out",
  },
};
