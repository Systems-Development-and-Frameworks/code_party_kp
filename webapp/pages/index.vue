<template>
  <div>
    <h1>News List</h1>
    <NewsList />
  </div>
</template>

<script>
import NewsList from "../components/NewsList";

export default {
  name: "App",
  components: {
    NewsList
  }
};
</script>
