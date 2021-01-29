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
    class="pb-4 mb-6 transition-all duration-150 bg-white rounded-lg shadow-lg hover:shadow-2xl flex lg:flex-col md:flex-col ms:flex-row"
  >
    <div class="my-auto w-full">
      <img
        src="https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png"
        alt="lovely avatar"
        class="h-24 mx-auto w-24 object-fill"
      />
    </div>

    <div
      class="pb-4 mb-6 transition-all duration-150 bg-white rounded-lg shadow-lg hover:shadow-2xl"
    >
      <hr class="border-gray-300" />

      <h2 class="text-2xl font-bold tracking-normal text-gray-800">
        {{ news.title }}({{ news.votes }})
      </h2>

      <hr class="border-gray-300" />
      <p class="px-4 py-2 text-gray-700 text-left">
        Aus dem Englischen übersetzt-Nuxt.js ist ein kostenloses
        Open-Source-Webanwendungsframework, das auf Vue.js, Node.js, Webpack und
        Babel.js basiert. Das Framework wird als "Meta-Framework für universelle
        Anwendungen" beworben.
      </p>
      <hr class="border-gray-300" />
      <section class="px-4 py-2 mt-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1">
            <button
              class="flex-no-shrink w-min p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey border-grey hover:bg-grey"
              @click="upvote"
              v-if="isAuthenticated"
            >
              Upvote
            </button>
            <button
              class="flex-no-shrink w-min p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey border-grey hover:bg-grey"
              v-if="isAuthenticated"
            >
              Downvote
            </button>
            <button
              class="flex-no-shrink w-min p-2 ml-4 mr-2 border-2 border-red-400 rounded hover:text-white text-grey border-grey hover:bg-grey"
              v-if="isAuthor"
            >
              Delete
            </button>
            <button
              class="flex-no-shrink w-min p-2 ml-4 mr-2 border-2 border-green-400 rounded hover:text-white text-grey border-grey hover:bg-grey"
              v-if="isAuthor"
            >
              Edit
            </button>
          </div>
        </div>
      </section>
    </div>
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
