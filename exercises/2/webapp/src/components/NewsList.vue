<template>
  <div class="newslist_container">
    <div>
      <ul>
        <li v-for="anews in newsSorted" :key="anews.id">
          <News :news="anews" @update="update" @remove="remove" />
        </li>
      </ul>
      <div v-if="isEmpty" class="emptyList">
        The list is empty :(
      </div>
    </div>
    <NewsForm :newTitle="newTitle" @create="create"/>
    <button @click="reverse" id="reverseButton">
      Reverse order
    </button>
  </div>
</template>

<script>
import News from "./News";
import NewsForm from "./NewsForm";
export default {
  data() {
    return {
      news: [
        { title: "VueJs", votes: 0, id: 1 },
        { title: "just", votes: 0, id: 2 },
        { title: "rocks", votes: 0, id: 3 },
      ],
      sortOrder: 1,
    };
  },
  components: {
    News,
    NewsForm
  },
  methods: {
    reverse() {
      this.sortOrder = this.sortOrder * -1;
    },
    update(newItem) {
      this.news = this.news.map((x) => (x.id == newItem.id ? newItem : x));
    },
    remove(newItem) {
      this.news = this.news.filter((x) => newItem.id !== x.id);
    },
    create(newItem) {
      this.news.push(newItem);
    },
  },
  computed: {
    newsSorted() {
      return [...this.news].sort(
        (a, b) => this.sortOrder * (b.votes - a.votes)
      );
    },
    isEmpty() {
      return this.news.length == 0;
    },
  },
};
</script>

<style>
ul {
  list-style-type: none;
}
</style>
