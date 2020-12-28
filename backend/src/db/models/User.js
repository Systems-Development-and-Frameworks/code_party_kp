module.exports = {
  id: {
    type: "uuid",
    primary: true,
  },
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    unique: true,
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
};
