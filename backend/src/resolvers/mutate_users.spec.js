import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource } from "../db";
import { verifyToken } from "../services/jwt.js";
import { hash } from "../services/hashing.js";
let mutate = undefined;
let db = undefined;

beforeEach(() => {
  db = new MemoryDataSource();
  const server = new Server({ dataSources: () => ({ db }) });

  let testClient = createTestClient(server);
  mutate = testClient.mutate;
});

describe("mutations", () => {
  describe("SIGNUP", () => {
    const action = (name, email, password) =>
      mutate({
        mutation: SIGNUP,
        variables: {
          name: name,
          email: email,
          password: password,
        },
      });
    const SIGNUP = gql`
      mutation($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password)
      }
    `;
    it("raises and error if password < 8 characters", async () => {
      expect(
        await action("Peter", "peter@widerstand-der-pinguine.ev", "pinguin")
      ).toMatchObject({
        data: { signup: null },
        errors: [{ message: "Password must be at least 8 characters long!" }],
      });
    });

    it("raises and error if email is taken", async () => {
      await db.addNewUser({
        name: "Peter's Bruder",
        email: "peter@widerstand-der-pinguine.ev",
        password: "hashed",
      });
      expect(
        await action("Peter", "peter@widerstand-der-pinguine.ev", "pinguin")
      ).toMatchObject({
        data: { signup: null },
        errors: [{ message: "Email already exists!" }],
      });
    });
    it("return a JWT if password > 8 characters and email is free", async () => {
      const {
        data: { signup },
        errors,
      } = await action(
        "Peter",
        "peter@widerstand-der-pinguine.ev",
        "P1nGu1n3S1nDk31n3Voeg3l"
      );
      expect(errors).toBeUndefined();
      let verified = verifyToken(signup);
      expect(verified).toEqual({
        exp: expect.anything(),
        iat: expect.anything(),
        id: expect.any(String),
      });
    });
  });

  describe("LOGIN", () => {
    const action = (email, password) =>
      mutate({
        mutation: LOGIN,
        variables: {
          email: email,
          password: password,
        },
      });
    const LOGIN = gql`
      mutation($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;
    it("raises and error if the user doesn't exist", async () => {
      expect(await action("A", "B")).toMatchObject({
        data: { login: null },
        errors: [{ message: "There is no user registered with this Email!" }],
      });
    });

    describe("given the user exists", () => {
      const password = "secure_password";
      beforeEach(async () => {
        await db.addNewUser({
          name: "Peter",
          email: "peter@widerstand-der-pinguine.ev",
          password: await hash(password),
          id: "1",
        });
      });

      it("raises and error if password doesn't match", async () => {
        expect(
          await action("peter@widerstand-der-pinguine.ev", "pinguin")
        ).toMatchObject({
          data: { login: null },
          errors: [{ message: "Password did not match!" }],
        });
      });

      it("returns a valid JWT if password matches", async () => {
        const {
          data: { login },
          errors,
        } = await action("peter@widerstand-der-pinguine.ev", password);
        expect(errors).toBeUndefined();
        let verified = verifyToken(login);
        expect(verified).toEqual({
          exp: expect.anything(),
          iat: expect.anything(),
          id: "1",
        });
      });
    });
  });
});
