
<template>
  <div id = "content">
    <div class="flex flex-row flex-wrap mx-auto">
      <div
        class="transition-all duration-150 flex w-full px-4 py-6 md:w-1/2 lg:w-1/3"
        v-for="anews in newsSorted"
        :key="anews.id"
      >
        <NewsItem :news="anews" @upvote="upvote" />
        <div v-if="isEmpty" class="emptyList">The list is empty :(</div>
      </div>
    </div>
    <div>
      <NewsForm @create="create" v-if="isAuthenticated" />
    </div>
    <div>
      <button @click="reverse" id="reverseButton">Reverse order</button>
    </div>
  </div>
</template>




<script>
import NewsItem from "./NewsItem";
import NewsForm from "./NewsForm";
import { gql } from "@apollo/client";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      sortOrder: 1,
    };
  },
  components: {
    NewsItem,
    NewsForm,
  },
  methods: {
    reverse() {
      this.sortOrder = this.sortOrder * -1;
    },
    async upvote(newItem) {
      const upvoteGql = gql`
        mutation($id: ID!) {
          upvote(id: $id) {
            id
            votes
          }
        }
      `;
      await this.$apollo.mutate({
        mutation: upvoteGql,
        variables: {
          id: newItem.id,
        },
      });
    },

    async create(newItem) {
      const createGql = gql`
        mutation($post: PostInput!) {
          write(post: $post) {
            id
          }
        }
      `;

      await this.$apollo.mutate({
        mutation: createGql,
        variables: {
          post: newItem,
        },
      });
    },
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    newsSorted() {
      return [...this.news].sort(
        (a, b) => this.sortOrder * (b.votes - a.votes)
      );
    },
    news() {
      return this.posts ?? [];
    },
    isEmpty() {
      return this.news.length == 0;
    },
  },
  apollo: {
    posts: {
      query: gql`
        query {
          posts {
            id
            title
            votes
            voters {
              id
            }
            author {
              id
            }
          }
        }
      `,
      pollInterval: 300, // ms
    },
  },
};
</script>

