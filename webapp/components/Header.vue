<template>
<header class="bg-gray-800 pt-10 sm:mt-10 pt-10">
<nav class="flex items-center justify-between flex-wrap bg-teal p-6">
  <div class="flex items-center flex-no-shrink text-white mr-6">
    <span class="font-semibold text-xl tracking-tight">Code-Party-KP</span>
    <button vclass="block lg:hidden" class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
      <svg class="h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    </button>
  </div>
  <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
    <div class="text-sm lg:flex-grow">
      <a href="/" class="block mt-4 text-white lg:inline-block lg:mt-0 tracking-tight hover:text-grey mr-4">
        Posts
      </a>
      </a>
    </div>
    <div>
      <nuxt-link class="inline-block text-sm px-4 py-2 bg-transparent leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-grey mt-4 lg:mt-0" to="/login" v-if="!isAuthenticated">Login</nuxt-link>
      <button class="inline-block text-sm px-4 py-2 bg-transparent leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-grey mt-4 lg:mt-0" v-else @click="logout">Logout</button>
    </div>
  </div>
</nav>
</header>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
  },
   data() {
    return {
      isVisible: false
    };
  },
  methods: {
    ...mapActions("auth", ["logout"])
  }
  
};

/**
 *   </div>
  <button @click="isVisible != isVisible">Visibility</button>

  v-show="!isVisible" 
  <div>
 */

</script>