import { jest } from "@jest/globals";
import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import Post from "../db/entities/Post";
import User from "../db/entities/User";
import { clean, close } from "../db/db";
import driver from "../driver";

let user = new User({
  name: "Peter",
  email: "peter@widerstand-der-pinguin.ev",
  password: "hashed",
});
let user2 = new User({
  name: "Peter's Bruder",
  email: "augustus@coalition-der-waschbaere.ev",
  password: "123",
});

let query;
let mutate;
let server;
beforeEach(async () => {
  server = new Server();
  const testClient = createTestClient(server);
  ({ query, mutate } = testClient);
  await clean();
  await Promise.all([user, user2].map((p) => p.save(p.password)));
  server.context = () => ({ id: user.id, driver: driver });
});
afterAll(async () => {
  await clean();
  await close();
  driver.close();
});

describe("mutations", () => {
  describe("WRITE_POST", () => {
    const actionWritePost = () =>
      mutate({
        mutation: WRITE_POST,
        variables: { title: "Some post" },
      });
    const WRITE_POST = gql`
      mutation($title: String!) {
        write(title: $title) {
          id
          title
          votes
          author {
            name
          }
        }
      }
    `;
    it("throws Forbidden error when unauthenticated", async () => {
      server.context = () => ({ id: "1", driver: driver });
      await expect(actionWritePost()).resolves.toMatchObject({
        errors: [
          expect.objectContaining({
            message: "You must be authenticated to write a post!",
            extensions: { code: "FORBIDDEN" },
          }),
        ],
        data: {
          write: null,
        },
      });
    });

    it("adds a post to db.postsData", async () => {
      expect(await Post.all()).toHaveLength(0);
      await actionWritePost();
      expect(await Post.all()).toHaveLength(1);
    });

    it("responds with created post", async () => {
      await expect(actionWritePost()).resolves.toMatchObject({
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
    let id = "500";
    const actionUpvote = () =>
      mutate({
        mutation: UPVOTE,
        variables: { id: id },
      });

    const UPVOTE = gql`
      mutation($id: ID!) {
        upvote(id: $id) {
          id
          title
          votes
          author {
            name
          }
        }
      }
    `;
    it("throws Forbidden error when unauthenticated", async () => {
      server.context = () => ({ id: "1", driver: driver });
      await expect(actionUpvote()).resolves.toMatchObject({
        errors: [
          expect.objectContaining({
            message: "You must be authenticated to upvote a post!",
            extensions: { code: "FORBIDDEN" },
          }),
        ],
        data: {
          upvote: null,
        },
      });
    });
    it("responds with null when the post doesn't exist", async () => {
      await expect(actionUpvote()).resolves.toMatchObject({
        errors: [
          expect.objectContaining({
            message: "Dont found the post with this id",
            extensions: { code: "FORBIDDEN" },
          }),
        ],
        data: { upvote: null },
      });
    });
    let post = new Post({ title: "Pinguine sind keine Vögel", author: user });
    describe("given posts in the database", () => {
      beforeEach(async () => {
        await post.save();
        id = post.id;
      });

      const actionGetPost = () =>
        query({
          query: GETPOST,
          variables: { id: id },
        });

      const GETPOST = gql`
        query($id: ID!) {
          Post(id: $id) {
            title
            votes
          }
        }
      `;

      it("upvotes a post", async () => {
        await expect(actionGetPost()).resolves.toMatchObject({
          errors: undefined,
          data: {
            Post: [
              {
                title: "Pinguine sind keine Vögel",
                votes: 0,
              },
            ],
          },
        });
        await actionUpvote();
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                title: "Pinguine sind keine Vögel",
                votes: 1,
              },
            ],
          },
        });
      });

      it("responds with the upvoted post", async () => {
        await expect(actionUpvote()).resolves.toMatchObject({
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
        await expect(actionGetPost()).resolves.toMatchObject({
          errors: undefined,
          data: {
            Post: [
              {
                title: "Pinguine sind keine Vögel",
                votes: 0,
              },
            ],
          },
        });
        await actionUpvote();
        await actionUpvote();
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                title: "Pinguine sind keine Vögel",
                votes: 1,
              },
            ],
          },
        });
      });

      it("upvoting a post by two users should result in 2 votes", async () => {
        await expect(actionGetPost()).resolves.toMatchObject({
          errors: undefined,
          data: {
            Post: [
              {
                title: "Pinguine sind keine Vögel",
                votes: 0,
              },
            ],
          },
        });
        await actionUpvote();
        server.context = () => ({ id: user2.id, driver: driver });
        await actionUpvote();
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                title: "Pinguine sind keine Vögel",
                votes: 2,
              },
            ],
          },
        });
      });
    });
  });
});
