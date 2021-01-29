<template>
  <div>
   <h1 class="text-gray-800 text-2xl font-semibold uppercase md:text-3xl">Hacker NEWs </h1>
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
