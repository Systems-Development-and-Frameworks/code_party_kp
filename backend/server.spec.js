import { createTestClient } from 'apollo-server-testing'
import { gql, mergeSchemas } from 'apollo-server'
import Server from './server'
import { MemoryDataSource, Post, User } from './db'

// FIXME: not re-initializing db introduces a non-atomic test
let db = new MemoryDataSource()
const server = new Server({ dataSources: () => ({ db }) })

const { query, mutate } = createTestClient(server)

//post tests
describe('queries', () => {
  describe('POSTS', () => {
    const POSTS = gql`
      query {
        posts {
          id
          title
        }
      }
    `;

    it('returns empty array', async () => {
      await expect(query({ query: POSTS }))
        .resolves
        .toMatchObject({
          errors: undefined,
          data: { posts: []}
        })
    })

  })
})

//TODO: user tests

//TODO: upvote test