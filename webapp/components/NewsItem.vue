<!--<template>
  <div>
    <h2>{{ news.title }}({{ news.votes }})</h2>
    <button @click="upvote" v-if="isAuthenticated">Upvote</button>
    <button v-if="isAuthenticated">Downvote</button>
    <button v-if="isAuthor">Delete</button>
    <button v-if="isAuthor">Edit</button>
  </div>
</template>-->
<template>
    <div
      class="flex flex-col items-stretch min-h-full pb-4 mb-6 transition-all duration-150 bg-white rounded-lg shadow-lg hover:shadow-2xl"
    >
      
      <hr class="border-gray-300" />
      <div class="flex flex-wrap items-center flex-1 px-4 py-1 text-center mx-auto">
        <a href="#" class="hover:underline">
          <h2 class="text-2xl font-bold tracking-normal text-gray-800">
           {{ news.title }}({{ news.votes }})
          </h2>
        </a>
      </div>
      <hr class="border-gray-300" />
      <p
        class="flex flex-row flex-wrap w-full px-4 py-2 overflow-hidden text-sm text-justify text-gray-700"
      >
        Aus dem Englischen übersetzt-Nuxt.js ist ein kostenloses Open-Source-Webanwendungsframework, das auf Vue.js,
         Node.js, Webpack und Babel.js basiert.
          Das Framework wird als "Meta-Framework für universelle Anwendungen" beworben.
      </p>
      <hr class="border-gray-300" />
       <section class="px-4 py-2 mt-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1">
            <button
            class="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey border-grey hover:bg-grey"
            @click="upvote"
            v-if="isAuthenticated"
          >
            Upvote
          </button>
          <button
            class="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey border-grey hover:bg-grey"
            v-if="isAuthenticated"
          >
            Downvote
          </button>
          <button
            class="flex-no-shrink p-2 ml-4 mr-2 border-2 border-red-400 rounded hover:text-white text-grey border-grey hover:bg-grey"
            v-if="isAuthor"
          >
            Delete
          </button>
          <button
            class="flex-no-shrink p-2 ml-4 mr-2 border-2 border-green-400 rounded hover:text-white text-grey border-grey hover:bg-grey"
            v-if="isAuthor"
          >
            Edit
          </button>
        </div>
        </div>
      </section>
    </div>

</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: { news: Object },
  methods: {
    async upvote() {
      this.$emit("upvote", this.news);
    },
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "currentUser"]),
    isAuthor() {
      return this.news.author.id === this.currentUser;
    },
  },
};
</script>
