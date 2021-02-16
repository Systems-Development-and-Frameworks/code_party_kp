<template>
  <form @submit.prevent class="relative flex-1 ml-20 mr-20 flex">
    <input
      t
      v-model="newTitle"
      placeholder="Post title"
      class="p-4 text-gray-700 w-full  bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
    />
    <button
      @click="click" :disabled="!newTitle" 
      class="bg-primary w-min  bg-yellow-300 text-black rounded font-lg absolute top-0 right-0 bottom-0 mt-1 mr-1 mb-1 px-8 font-semibold"
    >
      Create
    </button>
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
    async click() {
      const item = { title: this.newTitle };
      this.newTitle = "";
      this.$emit("create", item);
    },
  },
};
</script>
