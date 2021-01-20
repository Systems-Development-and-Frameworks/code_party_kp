<template>
  <div>
    <h2>{{ news.title }}({{ news.votes }})</h2>
    <button @click="upvote">Upvote</button>
    <button @click="downvote">Downvote</button>
    <button @click="remove">Remove</button>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: { news: Object },
  methods: {
    ...mapActions("post", ["upvote"]),
    async upvote() {
      this.$emit("update", { ...this.news, votes: (this.news.votes + 1)});
      await this.upvote({id: this.news.id});
    },
    downvote() {
      this.$emit("update", { ...this.news, votes: (this.news.votes - 1)});
      this.$emit("update", this.news);
    },
    remove() {
      this.$emit("remove", this.news);
    },
  },
};
</script>
