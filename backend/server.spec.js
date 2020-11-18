import { jest } from "@jest/globals";
import { createTestClient } from "apollo-server-testing";
import { gql, mergeSchemas } from "apollo-server";
import Server from "./server";
import { MemoryDataSource, Post, User } from "./db";

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

// describe('mutations', () => {
//   beforeEach(() => {
//     db = new MemoryDataSource()
//   })

//   describe('WRITE_POST', () => {
//     const action = () => mutate({ mutation: WRITE_POST, variables: { title: 'Some post' } })
//     const WRITE_POST = gql`
//     mutation($title: String!) {
//       write(title: $title) {
//         id
//         title
//       }
//     }
//   `


    describe('given posts in the database', () => {
      beforeEach(() => {
        db.addnewPost(new Post({ title: 'Some post', author: {name: "Any author"} }))
      })

      it('returns posts', async () => {
        await expect(query({ query: POSTS }))
          .resolves
          .toMatchObject({
            errors: undefined,
            data: { posts: [{ title: 'Some post', id: expect.any(String) }] }
          })
      })
    })
  })
})

//     it('calls db.createPost', async () => {
//       db.createPost = jest.fn(() => {})
//       await action()
//       expect(db.createPost).toHaveBeenCalledWith({ title: 'Some post' })
//     })

//     it('responds with created post', async () => {
//       await expect(action())
//         .resolves
//         .toMatchObject({
//           errors: undefined,
//           data: { write: { title: 'Some post', id: expect.any(String) } }
//         })
//     })
//   })
// })
