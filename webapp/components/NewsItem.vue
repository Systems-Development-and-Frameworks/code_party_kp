<template>
  <div>
    <h2>{{ news.title }}({{ news.votes }})</h2>
    <button @click="upvote" v-if="isAuthenticated">Upvote</button>
    <button @click="downvote" v-if="isAuthenticated">Downvote</button>
    <button
      @click="remove"
      v-if="isAuthenticated && news.author.id === currentUser"
    >
      Remove
    </button>
  </div>
</template>
<script>
import { gql } from "@apollo/client";

import { mapGetters } from "vuex";

export default {
  props: { news: Object },
  methods: {
    async upvote() {
      const upvoteGql = gql`
        mutation($id: ID!) {
          upvote(id: $id) {
            id
          }
        }
      `;
      await this.app.apolloProvider.defaultClient.mutate({
        mutation: upvoteGql,
        variables: {
          id: this.news.id,
        },
      });
      this.$emit("update", { ...this.news, votes: this.news.votes + 1 });
    },
    downvote() {
      this.$emit("update", { ...this.news, votes: this.news.votes - 1 });
    },
    remove() {
      this.$emit("remove", this.news);
    },
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "currentUser"]),
  },
};
</script>

