import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource, User, Post } from "../db";

let query = undefined;
let server = undefined;
let db = undefined;

beforeEach(() => {
  db = new MemoryDataSource();
  server = new Server({ dataSources: () => ({ db }) });
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
        let user = new User({
          name: "Peter",
          email: "peter@widerstand-der-penguine.ev",
          password: "hashed",
          id: "1",
        });
        let post = new Post({
          title: "Pinguine sind keine Vögel",
          author: user,
          id: "11",
        });
        db.usersData.push(user);
        db.postsData.push(post);
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
        let user = new User({
          name: "Peter",
          email: "peter@widerstand-der-penguine.ev",
          password: "hashed",
          id: "1",
        });
        let post = new Post({
          title: "Pinguine sind keine Vögel",
          author: user,
          id: "11",
        });
        db.usersData.push(user);
        db.postsData.push(post);
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
