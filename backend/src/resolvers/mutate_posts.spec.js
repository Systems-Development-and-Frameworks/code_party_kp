import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import Post from "../db/entities/Post";
import { clean, close, seedPosts, seedUsers } from "../db/db";
import driver from "../driver";
import fixture from "../db/fixture";

let mutate;
let query;
let server;
beforeEach(async () => {
  server = new Server();
  const testClient = createTestClient(server);
  //mock authentication
  server.context = () => ({ id: fixture.peter.id, driver });

  ({ mutate, query } = testClient);
  await clean();
  await seedUsers();
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
        variables: { post: { title: "Some post" } },
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

    it("adds a post to the database", async () => {
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
    const actionUpvote = (id) =>
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

    it("responds with null when the post doesn't exist", async () => {
      await expect(actionUpvote("id-not-included")).resolves.toMatchObject({
        errors: [
          expect.objectContaining({
            message: "Couldn't find a post with given id!",
            extensions: { code: "FORBIDDEN" },
          }),
        ],
        data: { upvote: null },
      });
    });
    describe("given posts in the database", () => {
      beforeEach(async () => {
        await seedPosts();
      });

      const actionGetPost = () =>
        query({
          query: GET_POST,
          variables: { id: fixture.petersPost.id },
        });

      const GET_POST = gql`
        query($id: ID!) {
          Post(id: $id) {
            votes
          }
        }
      `;

      it("upvotes a post", async () => {
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                votes: 0,
              },
            ],
          },
        });
        await actionUpvote(fixture.petersPost.id);
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                votes: 1,
              },
            ],
          },
        });
      });

      it("responds with the upvoted post", async () => {
        await expect(
          actionUpvote(fixture.petersPost.id)
        ).resolves.toMatchObject({
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
          data: {
            Post: [
              {
                votes: 0,
              },
            ],
          },
        });
        await actionUpvote(fixture.petersPost.id);
        await actionUpvote(fixture.petersPost.id);
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                votes: 1,
              },
            ],
          },
        });
      });

      it("upvoting a post by two users should result in 2 votes", async () => {
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                votes: 0,
              },
            ],
          },
        });
        await actionUpvote(fixture.petersPost.id);
        server.context = () => ({ id: fixture.brother.id, driver: driver });
        await actionUpvote(fixture.petersPost.id);
        await expect(actionGetPost()).resolves.toMatchObject({
          data: {
            Post: [
              {
                votes: 2,
              },
            ],
          },
        });
      });
    });
  });
});
