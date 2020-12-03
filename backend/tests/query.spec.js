import { jest } from "@jest/globals";
import { createTestClient } from "apollo-server-testing";
import { AuthenticationError } from "apollo-server-errors";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource } from "../db";

let query = undefined;
let db = undefined;

beforeEach(() => {
  db = new MemoryDataSource();
  const server = new Server({ dataSources: () => ({ db }) });
  let testClient = createTestClient(server);
  query = testClient.query;
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
      beforeEach(() => {
        db.addnewPost({
          title: "Pinguine sind keine Vögel",
          author: { name: "Peter" },
        });
      });

      it("returns users", async () => {
        await expect(query({ query: USERS })).resolves.toMatchObject({
          errors: undefined,
          data: {
            users: [
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
      beforeEach(() => {
        db.addnewPost({
          title: "Pinguine sind keine Vögel",
          author: { name: "Peter" },
        });
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
