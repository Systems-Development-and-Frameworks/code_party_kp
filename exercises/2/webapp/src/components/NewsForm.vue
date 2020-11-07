<template>
  <form @submit.prevent>
    <input v-model="newTitle" />
    <button @click="click" :disabled="!newTitle">Create</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      newTitle: "",
    };
  },
  methods: {
    click() {
      const item = { title: this.newTitle, votes: 0, id: Date.now() };
      this.newTitle = "";
      this.$emit("create", item);
    },
  },
};
</script>
