<template>
  <header class="bg-gray-800 pt-10 sm:mt-10 pt-10">
    <h3
      class="text-2xl font-sans:'Helvetica' leading-7 text-gray-400 sm:text-3xl sm:truncate"
    >
      Code-Party-KP
    </h3>
    <nav>
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              @click="isVisible = !isVisible"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <svg
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                class="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="absolute inset-y-auto right-0 hidden sm:block sm:ml-6">
            <template v-if="isAuthenticated">
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                @click="logout"
              >
                Logout
              </button>
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <nuxt-link to="/">Posts</nuxt-link>
              </button>
            </template>
            <template v-else>
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <nuxt-link to="/login">Login</nuxt-link>
              </button>
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <nuxt-link to="/">Posts</nuxt-link>
              </button>
            </template>
          </div>
        </div>
      </div>
      <transition>
        <div v-show="isVisible" class="visible md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <div v-if="isAuthenticated">
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                @click="logout"
              >
                Logout
              </button>
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <nuxt-link to="/">Posts</nuxt-link>
              </button>
            </div>
            <div v-else>
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <nuxt-link to="/login">Login</nuxt-link>
              </button>
              <button
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <nuxt-link to="/">Posts</nuxt-link>
              </button>
            </div>
          </div>
        </div>
      </transition>
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
      isVisible: false,
    };
  },
  methods: {
    ...mapActions("auth", ["logout"]),
  },
};

/**
 *   </div>
  <button @click="isVisible != isVisible">Visibility</button>

  v-show="!isVisible" 
  <div>
 */
</script>