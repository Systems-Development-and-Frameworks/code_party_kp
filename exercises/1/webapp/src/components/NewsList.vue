<template>
  <div class="newslist_container">
    <div>
      <ul>
        <li v-for="anews in newsSorted" :key="anews.id">
          <News :news="anews" @update="update" @remove="remove" />
        </li>
      </ul>
    </div>
    <form @submit.prevent>
      <input v-model="newTitle" />
      <button @click="create">Create</button>
    </form>
  </div>
</template>

<script>
import News from "./News";
export default {
  data() {
    return {
      news: [
        { title: "VueJs", votes: 0, id: 1 },
        { title: "just", votes: 0, id: 2 },
        { title: "rocks", votes: 0, id: 3 },
      ],
      newTitle: "",
    };
  },
  components: {
    News,
  },
  methods: {
    update(newItem) {
      this.news = this.news.map((x) => (x.id == newItem.id ? newItem : x));
    },
    remove(newItem) {
      this.news = this.news.filter((x) => newItem.id !== x.id);
    },
    create() {
      var item = { title: this.newTitle, votes: 0, id: Date.now() };
      this.newTitle = "";
      this.news.push(item);
    },
  },
  computed: {
    newsSorted() {
      return [...this.news].sort((a, b) => b.votes - a.votes);
    },
  },
};
</script>
<style>
ul {
  list-style-type: none;
}
</style>
