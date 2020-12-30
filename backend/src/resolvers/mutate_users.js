const jwt = require("../services/jwt.js");
import { AuthenticationError, UserInputError } from "apollo-server";
import User from "../db/entities/User";

function isPasswordStrong(password) {
  return password.length >= 8;
}

export default ({ subschema }) => ({
  Mutation: {
    login: async (_parent, { email, password }) => {
      const user = await User.first({ email });
      if (!user) {
        throw new UserInputError(
          "There is no user registered with this Email!"
        );
      }
      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect)
        throw new AuthenticationError("Password did not match!");
      return jwt.issueToken(user.id);
    },

    signup: async (_parent, { name, email, password }) => {
      let emailExists = await User.exists({ email });
      if (emailExists) throw new UserInputError("Email already exists!");
      if (!isPasswordStrong(password))
        throw new UserInputError(
          "Password must be at least 8 characters long!"
        );
      const user = new User({
        name: name,
        email: email,
      });
      await user.save(password);
      return jwt.issueToken(user.id);
    },
  },
});
