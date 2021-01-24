<template>
  <div>
    <h2>{{ news.title }}({{ news.votes }})</h2>
    <button @click="upvote" v-if="isAuthenticated">Upvote</button>
    <button v-if="isAuthenticated">Downvote</button>
    <button v-if="isAuthenticated">Remove</button>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: { news: Object },
  methods: {
    async upvote() {
      this.$emit("upvote", this.news);
    }
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  }
};
</script>
