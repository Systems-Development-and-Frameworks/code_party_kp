<template>
  <nav class="nav-bar">
    <div>
      <nuxt-link to="/">Posts</nuxt-link>
    </div>
    <div>
        <nuxt-link to="/login" v-if="!isAuthenticated">Login</nuxt-link>
        <button v-else @click="logout">Logout</button>    
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