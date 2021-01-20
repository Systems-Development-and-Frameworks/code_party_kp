<template>
  <div>
    <h2>{{ news.title }}({{ news.votes }})</h2>
    <button @click="upvote" v-if="isAuthenticated">Upvote</button>
    <button @click="downvote" v-if="isAuthenticated">Downvote</button>
    <button @click="remove" v-if="isAuthenticated && newsItem.author === currentUser" >Remove</button>
  </div>
</template>
<script>

import {mapGetters} from "vuex";
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
  computed: {
     ...mapGetters('auth', ['isAuthenticated', 'currentUser'])
   }
};
</script>
