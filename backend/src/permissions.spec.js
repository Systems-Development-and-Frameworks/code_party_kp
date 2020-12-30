import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "./server";
import { clean, seed, close } from "./db/db.js";
//TODO @maybe that's a singleton, right? so what happens if closed by multiple suits?
import driver from "./driver";
import fixture from "./db/fixture.js";

let mutate;
let query;
let server;
beforeEach(async () => {
  server = new Server();
  let testClient = createTestClient(server);
  mutate = testClient.mutate;
  query = testClient.query;

  await clean();
  await seed();
});

afterAll(async () => {
  await close();
  await driver.close();
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
      server.context = () => ({ id: "not-in-db", driver });
      await expect(action()).resolves.toMatchObject({
        errors: [{ message: "Not Authorised!" }],
        data: {
          write: null,
        },
      });
    });
    it("responds with created post if user is authenticated", async () => {
      server.context = () => ({ id: fixture.peter.id, driver });
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
          "Geogre",
          "geogre@widerstand-der-pinguine.ev",
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
          data: {
            users: expect.arrayContaining([
              ({ name: "Peter" }, { name: "Peter's Bruder" }),
            ]),
          },
        });
      });
    });
  });
});
