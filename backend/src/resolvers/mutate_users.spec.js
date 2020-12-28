import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource } from "../db";
import { verifyToken } from "../services/jwt.js";
import { hash } from "../services/hashing.js";
import { clean, close, seed } from "../db/db";
import driver from "../driver";


let server = new Server();
let testClient = createTestClient(server);
let mutate = testClient.mutate;

 

describe("mutations", () => {
  beforeAll(async () => {
    await clean();
    await seed();
  });
  
  afterAll(async () => {
    await close()
    await driver.close()
  }); 
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
        await action("geogre", "geogre@widerstand-der-pinguine.ev", "pin")
      ).toMatchObject({
        data: { signup: null },
        errors: [{ message: "Password must be at least 8 characters long!" }],
      });
    });

    it("raises an error if email is taken", async () => {
      expect(
        await action("Peter", "peter@widerstand-der-pinguin.ev", "sldfjwrkkev")
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
        "Geogre",
        "geogre@widerstand-der-pinguine.ev",
        "sfseltuowu3979fdk"
      );
      expect(errors).toBeUndefined();
      let verified = verifyToken(signup);
      expect(verified).toEqual({
        exp: expect.any(Number),
        iat: expect.any(Number),
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
      it("raises and error if password doesn't match", async () => {
        expect(
          await action("peter@widerstand-der-pinguin.ev", "pinguin")
        ).toMatchObject({
          data: { login: null },
          errors: [{ message: "Password did not match!" }],
        });
      });

      it("returns a valid JWT if password matches", async () => {
        const {
          data: { login },
          errors,
        } = await action("peter@widerstand-der-pinguin.ev", "hashed");
        expect(errors).toBeUndefined();
        let verified = verifyToken(login);
        expect(verified).toEqual({
          exp: expect.anything(),
          iat: expect.anything(),
          id: "b5bc19f4-164e-49c3-8045-7105580b43be",
        });
      });
    });
  });
});
