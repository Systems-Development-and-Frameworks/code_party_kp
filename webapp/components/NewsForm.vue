<template>
  <form @submit.prevent>
    <input v-model="newTitle" aria-label="title" />
    <button @click="click" :disabled="!newTitle" v-if="isAuthenticated">Create</button>
  </form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      newTitle: ""
    };
  },
  methods: {
    async click() {
      const item = { title: this.newTitle };
      this.newTitle = "";
      this.$emit("create", item);
    }
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  }
};
</script>
