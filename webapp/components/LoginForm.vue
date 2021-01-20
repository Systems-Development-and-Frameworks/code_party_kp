<template>
  <h1 class="info" v-if="isAuthenticated">Successfully logged in!</h1>
  <form v-else @submit.prevent="submit">
    <label>Email</label>
    <input id="email" v-model="email" aria-label="email" />
    <label>Password</label>
    <input
      id="password"
      v-model="password"
      aria-label="password"
      type="password"
    />
    <button :disabled="!(email && password)" type="submit">
      Login
    </button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      //TODO remove later
      email: "peter@widerstand-der-pinguine.ev",
      password: "peter1",
      error: ""
    };
  },
  computed: mapGetters("auth", ["isAuthenticated"]),
  methods: {
    ...mapActions("auth", ["login"]),
    async submit() {
      try {
        const success = await this.login({
          email: this.email,
          password: this.password
        });
        if (success) this.error = "";
        else this.error = "Incorrect email/password!";
      } catch (err) {
        this.error = "Internal ERROR: Something went wrong!";
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
