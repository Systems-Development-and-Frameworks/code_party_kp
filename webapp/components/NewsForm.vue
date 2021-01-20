<template>
  <form @submit.prevent>
    <input v-model="newTitle" aria-label="title" />
    <button @click="click" :disabled="!newTitle">Create</button>
  </form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      newTitle: "",
    };
  },
  methods: {
    ...mapActions("auth", ["write"]),
    async click() {
      const item = { title: this.newTitle, votes: 0, id: Date.now() };
      await this.write({title: item.title, id: item.id});
      this.newTitle = "";
      this.$emit("create", item);
     
    },
  },
};
</script>
