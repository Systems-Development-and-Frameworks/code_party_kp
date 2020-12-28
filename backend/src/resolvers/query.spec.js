import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import { clean, seed, close } from "../db/db.js";
import driver from "../driver";

let server = new Server();
let testClient = createTestClient(server);
let query = testClient.query;

beforeAll(async () => {
  await clean();
});

afterAll(async () => {
  await close();
  await driver.close();
});

describe("queries", () => {
  describe("USERS", () => {
    const USERS = gql`
      query {
        users {
          name
          posts {
            title
            id
            votes
            author {
              name
            }
          }
        }
      }
    `;

    it("returns empty array", async () => {
      await expect(query({ query: USERS })).resolves.toMatchObject({
        errors: undefined,
        data: { users: [] },
      });
    });

    describe("given users in the database", () => {
      beforeAll(async () => {
        await seed();
      });
      afterAll(async () => {
        await clean();
      });

      it("returns users", async () => {
        await expect(query({ query: USERS })).resolves.toMatchObject({
          errors: undefined,
          data: {
            users: [
              {
                name: "Peter's Bruder",
                posts: [],
              },
              {
                name: "Peter",
                posts: [
                  {
                    title: "Pinguine sind keine Vögel",
                    id: expect.any(String),
                    votes: 0,
                    author: { name: "Peter" },
                  },
                ],
              },
            ],
          },
        });
      });
      it("is able to serve nested queries", async () => {
        const USERS_NESTED = gql`
          query {
            users {
              name
              posts {
                title
                id
                votes
                author {
                  name
                  posts {
                    title
                    id
                    votes
                    author {
                      name
                      posts {
                        title
                        id
                        votes
                        author {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
        await expect(query({ query: USERS_NESTED })).resolves.toMatchObject({
          errors: undefined,
          data: {
            users: [
              {
                name: "Peter's Bruder",
                posts: [],
              },
              {
                name: "Peter",
                posts: [
                  {
                    title: "Pinguine sind keine Vögel",
                    id: expect.any(String),
                    votes: 0,
                    author: {
                      name: "Peter",
                      posts: [
                        {
                          title: "Pinguine sind keine Vögel",
                          id: expect.any(String),
                          votes: 0,
                          author: {
                            name: "Peter",
                            posts: [
                              {
                                title: "Pinguine sind keine Vögel",
                                id: expect.any(String),
                                votes: 0,
                                author: { name: "Peter" },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        });
      });
    });
  });

  describe("POSTS", () => {
    const POSTS = gql`
      query {
        posts {
          id
          title
          votes
          author {
            name
          }
        }
      }
    `;

    it("returns empty array", async () => {
      await expect(query({ query: POSTS })).resolves.toMatchObject({
        errors: undefined,
        data: { posts: [] },
      });
    });

    describe("given posts in the database", () => {
      beforeAll(async () => {
        await seed();
      });
      afterAll(async () => {
        await clean();
      });

      it("returns posts", async () => {
        await expect(query({ query: POSTS })).resolves.toMatchObject({
          errors: undefined,
          data: {
            posts: [
              {
                title: "Pinguine sind keine Vögel",
                id: expect.any(String),
                votes: 0,
                author: { name: "Peter" },
              },
            ],
          },
        });
      });
    });
  });
});
