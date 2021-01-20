<template>
  <form @submit.prevent>
    <label>Email</label>
    <input v-model="email" aria-label="email" />
    <label>Password</label>
    <input v-model="password" aria-label="password" type="password" />
    <button @click="submit" :disabled="!(email && password)">Login</button>
    <div v-if="error" class="error">{{error}}</div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      //TODO remove later
      email: "peter@widerstand-der-pinguine.ev",
      password: "peter1",
      error: ""
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async submit() {
      try {
        await this.login({
          email: this.email,
          password: this.password
        });
      } catch (err) {
        //TODO potentially better display for the user
        console.log(err);
        this.error =
          "ERROR: Something went wrong or email / password incorrect!";
      }
    }
  }
};
</script>

<style>
form {
  display: inline-grid;
  grid-template-columns: min-content min-content;
  grid-gap: 16px;
  margin: auto;
}
label {
  grid-column: 1 / 2;
}
input,
button {
  grid-column: 2 / 3;
  width: 220px;
}
.error {
  grid-column: 1 / 3;
  text-align: center;
}
</style>
