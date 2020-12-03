import { jest } from "@jest/globals";
import { createTestClient } from "apollo-server-testing";
import { AuthenticationError } from "apollo-server-errors";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource } from "../db";

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
    const actionWithParam = (name, email, password) =>
      mutate({
        mutation: SIGNUP,
        variables: {
          post: { name: name, email: email, password: password },
        },
      });
    const action = () =>
      actionWithParam("AzureDiamond", "AzureDiamond@fake.com", "hunter2");
    const SIGNUP = gql`
      mutation($name: String!, $email: String!, $password: String!) {
        write(name: $name, email: $email, password: $password) {
          jwt
        }
      }
    `;
    it("return null if password < 8 characters", () => {
      fail("TODO");
    });

    it("return null if email is taken", () => {
      fail("TODO");
    });
    it("return a JWT if password > 8 characters and email is free", () => {
      fail("TODO");
    });
  });

  describe("LOGIN", () => {
    const actionWithParam = (email, password) =>
      mutate({
        mutation: LOGIN,
        variables: {
          post: { email: email, password: password },
        },
      });
    const action = () => actionWithParam("AzureDiamond@fake.com", "hunter2");
    const LOGIN = gql`
      mutation($email: String!, $password: String!) {
        write(email: $email, password: $password) {
          jwt
        }
      }
    `;
    it("if the user does not exist, return null", async () => {
      fail("TODO");
    });

    describe("given the user exists", () => {
      beforeEach(() => {
        //TODO add user
      });

      it("returns a valid JWT if password matches", () => {
        fail("TODO");
      });
      it("returns null if password doesn't match", () => {
        fail("TODO");
      });
    });
  });
});
