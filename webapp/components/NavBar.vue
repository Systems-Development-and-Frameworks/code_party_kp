<template>
  <nav class="nav-bar">
    <div>
      <nuxt-link to="/login" v-if="!isAuthenticated">Login</nuxt-link>
      <!-- <button @click="logout" v-if="isAuthenticated">Logout</button> -->
    </div>
    <div>
      <template v-if="isAuthenticated">
        <button @click="logout">Logout</button>
      </template>
      <template v-else> You are not logged in! </template>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
  },
}
</script>

<style>
.nav-bar {
  top: 0;
  position: fixed;
  width: 95%;
  height: 0rem;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
}
</style>