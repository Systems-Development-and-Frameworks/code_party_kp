<template>
  <div class="newslist_container">
    <div>
      <ul>
        <li v-for="anews in newsSorted" :key="anews.id">
          <NewsItem :news="anews" @update="update" @remove="remove" />
        </li>
      </ul>
      <div v-if="isEmpty" class="emptyList">The list is empty :(</div>
    </div>
    <NewsForm @create="create" />
    <button @click="reverse" id="reverseButton">Reverse order</button>
  </div>
</template>

<script>
import NewsItem from "./NewsItem";
import NewsForm from "./NewsForm";
import { gql } from "@apollo/client";
export default {
  data() {
    return {
      // news: [],
      sortOrder: 1
    };
  },
  components: {
    NewsItem,
    NewsForm
  },
  methods: {
    reverse() {
      this.sortOrder = this.sortOrder * -1;
    },
    update(newItem) {
      this.news = this.news.map(x => (x.id == newItem.id ? newItem : x));
    },
    remove(newItem) {
      this.news = this.news.filter(x => newItem.id !== x.id);
    },

    create(newItem) {
      this.news.push(newItem);
    }
  },
  computed: {
    newsSorted() {
      return [...this.news].sort(
        (a, b) => this.sortOrder * (b.votes - a.votes)
      );
    },
    news() {
      return this.posts;
    },
    isEmpty() {
      return this.news.length == 0;
    }
    // GQL and in 'update', 'remove', 'create', 'init' fetch data again or polling?
  },
  apollo: {
    posts: {
      query: gql`
        query {
          posts {
            id
            title
            votes
            author {
              id
            }
          }
        }
      `
      //,pollInterval: 300 // ms
    }
  }
};
</script>

<style>
ul {
  list-style-type: none;
}
</style>
