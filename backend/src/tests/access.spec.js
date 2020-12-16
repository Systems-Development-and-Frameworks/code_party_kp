import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource, User } from "../db";

let mutate;
let query;
let db;
let server;
beforeEach(() => {
  db = new MemoryDataSource();
  server = new Server({ dataSources: () => ({ db }) });
  let testClient = createTestClient(server);
  mutate = testClient.mutate;
  query = testClient.query;

  db.usersData.push(
    new User({
      name: "Peter",
      email: "peter@widerstand-der-pinguin.ev",
      password: "hashed",
      id: "1",
    })
  );
});
describe("Mutation", () => {
  describe("write", () => {
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

    it("throws `Not Authorised` if not authenticated", async () => {
      await expect(action()).resolves.toMatchObject({
        errors: [{ message: "Not Authorised!" }],
        data: {
          write: null,
        },
      });
    });

    it("throws `Not Authorised` if JWT is valid but user has been deleted", async () => {
      server.context = () => ({ id: "not-in-db" });
      await expect(action()).resolves.toMatchObject({
        errors: [{ message: "Not Authorised!" }],
        data: {
          write: null,
        },
      });
    });
    it("responds with created post if user is authenticated", async () => {
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
      const action = ({ name, email, password }) =>
        mutate({
          mutation: SIGNUP,
          variables: { name, email, password },
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
      it("responds with array of users", async () => {
        await expect(query({ query: USERS })).resolves.toMatchObject({
          errors: undefined,
          data: { users: [{ name: "Peter" }] },
        });
      });
    });
  });
});
