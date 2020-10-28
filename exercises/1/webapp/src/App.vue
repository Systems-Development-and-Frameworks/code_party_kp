<template>
  <div id="app">
    <Header />
    <NewsList />
  </div>
</template>

<script>
import Header from "./components/Header";
import NewsList from "./components/NewsList";

export default {
  name: "App",
  components: {
    Header,
    NewsList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
