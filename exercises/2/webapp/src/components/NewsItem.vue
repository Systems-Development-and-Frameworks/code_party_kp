<template>
  <div>
    <h2>{{ news.title }}({{ news.votes }})</h2>
    <button @click="upvote">Upvote</button>
    <button @click="downvote">Downvote</button>
    <button @click="remove">Remove</button>
  </div>
</template>
<script>
export default {
  props: { news: Object },
  methods: {
    upvote() {
      this.$emit("update", { ...this.news, votes: (this.news.votes + 1)});
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
