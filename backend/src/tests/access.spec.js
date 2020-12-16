import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource, User } from "../db";

let mutate = undefined;
let query = undefined;
let db = undefined;
let server = undefined;
beforeEach(() => {
  db = new MemoryDataSource();
  server = new Server({ dataSources: () => ({ db }) });
  let testClient = createTestClient(server);
  ({ mutate, query }) = testClient;

  let user = new User({
    name: "Peter",
    email: "peter@widerstand-der-pinguin.ev",
    password: "hashed",
    id: "1",
  });
  db.usersData.push(user);
});
describe("Accessing", () => {
  describe("protected", () => {
    const action = () =>
      mutate({
        mutation: WRITE_POST,
        variables: { post: { title: "Some post" } },
      });
    const WRITE_POST = gql`
      mutation($post: PostInput!) {
        write(post: $post) {
          title
        }
      }
    `;

    it("fails if id is not specified", async () => {
      await expect(action()).resolves.toMatchObject({
        errors: [{ message: "Not Authorised!" }],
        data: {
          write: null,
        },
      });
    });

    it("fails if id is not in database", async () => {
      server.context = () => ({ id: "not-in-db" });
      await expect(action()).resolves.toMatchObject({
        errors: [{ message: "Not Authorised!" }],
        data: {
          write: null,
        },
      });
    });
    it("succeeds if id is in the database", async () => {
      server.context = () => ({ id: "1" });
      await expect(action()).resolves.toMatchObject({
        errors: undefined,
        data: {
          write: expect.anything(),
        },
      });
    });
  });

  describe("unprotected", () => {
    describe("mutation", () => {
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
      it("succeeds without authentication information for mutate", async () => {
        const {
          data: { signup },
          errors,
        } = await action(
          "Peter",
          "peter@widerstand-der-pinguine.ev",
          "P1nGu1n3S1nDk31n3Voeg3l"
        );
        expect(errors).toBeUndefined();
        expect(signup).toEqual(expect.any(String));
      });
    });

    describe("query", () => {
      const USERS = gql`
        query {
          users {
            name
          }
        }
      `;
      it("succeeds without authentication information for query", async () => {
        await expect(query({ query: USERS })).resolves.toMatchObject({
          errors: undefined,
          data: { users: [{ name: "Peter" }] },
        });
      });
    });
  });
});
