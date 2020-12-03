import { jest } from "@jest/globals";
import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server";
import Server from "../server";
import { MemoryDataSource, User } from "../db";

let mutate = undefined;
let db = undefined;
let server = undefined;
beforeEach(() => {
  db = new MemoryDataSource();
  server = new Server({ dataSources: () => ({ db }) });
  let testClient = createTestClient(server);
  mutate = testClient.mutate;

  let user = new User({
    name: "Peter",
    email: "peter@widerstand-der-pinguin.ev",
    password: "hashed",
    id: "1",
  });
  let user2 = new User({
    name: "Peter's Bruder",
    email: "augustus@coalition-der-waschbaere.ev",
    password: "hashed",
    id: "2",
  });
  db.usersData.push(user);
  db.usersData.push(user2);
  server.context = () => ({ id: 1 });
});

describe("mutations", () => {
  describe("WRITE_POST", () => {
    const action = () =>
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
    it("adds a post to db.postsData", async () => {
      expect(db.postsData).toHaveLength(0);
      await action();
      expect(db.postsData).toHaveLength(1);
    });

    it("calls db.addBewPost", async () => {
      db.addNewPost = jest.fn(() => {});
      await action();
      expect(db.addNewPost).toHaveBeenCalledWith({
        title: "Some post",
        author: {
          name: "Peter",
          email: "peter@widerstand-der-pinguin.ev",
          password: "hashed",
          id: "1",
        },
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
});

describe("UPVOTE", () => {
  let id = "500";
  const action = () =>
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
    await expect(action()).resolves.toMatchObject({
      errors: undefined,
      data: { upvote: null },
    });
  });

  describe("given posts in the database", () => {
    beforeEach(async () => {
      await db.addNewPost({
        title: "Pinguine sind keine Vögel",
        author: db.usersData[0],
        id,
      });
    });
    it("upvotes a post", async () => {
      expect(db.postsData[0].votes).toBe(0);
      await action();
      expect(db.postsData[0].votes).toBe(1);
    });

    it("calls db.upvote", async () => {
      db.upvote = jest.fn(() => {});
      await action();
      expect(db.upvote).toHaveBeenCalledWith(id, {
        name: "Peter",
        email: "peter@widerstand-der-pinguin.ev",
        password: "hashed",
        id: "1",
      });
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
      server.context = () => ({ id: "2" });
      await action();
      expect(db.postsData[0].votes).toBe(2);
    });
  });
});
