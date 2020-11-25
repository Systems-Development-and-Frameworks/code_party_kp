import { jest } from "@jest/globals";
import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "./server";
import { MemoryDataSource } from "./db";

let query = undefined;
let mutate = undefined;
let db = undefined;

beforeEach(() => {
  db = new MemoryDataSource();
  const server = new Server({ dataSources: () => ({ db }) });
  let testClient = createTestClient(server);
  query = testClient.query;
  mutate = testClient.mutate;
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

describe("mutations", () => {
  beforeEach(() => {
    db = new MemoryDataSource();
  });

  describe("WRITE_POST", () => {
    const action = () =>
      mutate({
        mutation: WRITE_POST,
        variables: { post: { title: "Some post", author: { name: "Peter" } } },
      });
    const WRITE_POST = gql`
      mutation($post: PostInput!) {
        write(post: $post) {
          id
          title
          votes
          author {
            name
          }
        }
      }
    `;

    it("adds a post to db.postsData", async () => {
      expect(db.postsData).toHaveLength(0);
      await action();
      expect(db.postsData).toHaveLength(1);
    });

    it("calls db.addnewPost", async () => {
      db.addnewPost = jest.fn(() => {});
      await action();
      expect(db.addnewPost).toHaveBeenCalledWith({
        title: "Some post",
        author: { name: "Peter" },
      });
    });

    it("responds with created post", async () => {
      await expect(action()).resolves.toMatchObject({
        errors: undefined,
        data: {
          write: {
            title: "Some post",
            id: expect.any(String),
            votes: 0,
            author: { name: "Peter" },
          },
        },
      });
    });
  });

  describe("UPVOTE", () => {
    let id = 500;
    let voterName = "Peter";
    const action = () =>
      mutate({
        mutation: UPVOTE,
        variables: { id: id, voter: { name: voterName } },
      });

    const UPVOTE = gql`
      mutation($id: ID!, $voter: UserInput!) {
        upvote(id: $id, voter: $voter) {
          id
          title
          votes
          author {
            name
          }
        }
      }
    `;

    it("responds with null when the post doesn't exist", async () => {
      await expect(action()).resolves.toMatchObject({
        errors: undefined,
        data: { upvote: null },
      });
    });

    describe("given posts in the database", () => {
      beforeEach(() => {
        db.addnewPost({
          title: "Pinguine sind keine Vögel",
          author: { name: "Peter" },
        });
        id = db.postsData[0].id;
      });
      it("upvotes a post", async () => {
        expect(db.postsData[0].votes).toBe(0);
        await action();
        expect(db.postsData[0].votes).toBe(1);
      });

      it("calls db.upvote", async () => {
        db.upvote = jest.fn(() => {});
        await action();
        expect(db.upvote).toHaveBeenCalledWith(id, { name: voterName });
      });

      it("responds with the upvoted post", async () => {
        await expect(action()).resolves.toMatchObject({
          errors: undefined,
          data: {
            upvote: {
              votes: 1,
              title: "Pinguine sind keine Vögel",
              id: expect.any(String),
              author: { name: "Peter" },
            },
          },
        });
      });

      it("upvoting a post twice by the same user results in 1 vote", async () => {
        expect(db.postsData[0].votes).toBe(0);
        await action();
        await action();
        expect(db.postsData[0].votes).toBe(1);
      });

      it("upvoting a post by two users should result in 2 votes", async () => {
        expect(db.postsData[0].votes).toBe(0);
        await action();
        voterName = "Peter's brother";
        await action();
        expect(db.postsData[0].votes).toBe(2);
      });
    });
  });
});
