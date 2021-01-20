<template>
  <form @submit.prevent>
    <input v-model="newTitle" aria-label="title" />
    <button @click="click" :disabled="!newTitle" v-if="isAuthenticated">
      Create
    </button>
    <button @click="update" v-if="isAuthenticated">Change</button>
  </form>
</template>

<script>
import { gql } from "@apollo/client";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      newTitle: "",
    };
  },
  methods: {
    async click() {
      const writeGql = gql`
        mutation($post: PostInput!) {
          write(post: $post) {
            id
          }
        }
      `;
      await this.app.apolloProvider.defaultClient.mutate({
        mutation: writeGql,
        variables: {
          post: { title: this.newTitle },
        },
      });
      const item = { title: this.newTitle, votes: 0, id: Date.now() };
      this.newTitle = "";
      this.$emit("create", item);
    },
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
  },
};
</script>
