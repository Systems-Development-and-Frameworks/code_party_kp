<template>
  <form @submit.prevent>
    <label>Username</label>
    <input v-model="username" aria-label="user-name" />
    <label>Password</label>
    <!--TODO should be hidden after properly connected to backend and tests-->
    <input v-model="password" aria-label="password" />
    <button @click="login" :disabled="!(username && password)">Login</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      //  TODO call backend
    }
  }
};
</script>

<style>
form {
  display: inline-grid;
  grid-template-columns: 1f min-content min-content 1f;
  grid-gap: 16px;
  margin: auto;
}
label {
  grid-column: 2 / 3;
}
input,
button {
  grid-column: 3 / 4;
}
</style>