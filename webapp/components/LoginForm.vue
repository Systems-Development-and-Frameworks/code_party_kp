
<template>
  <div>
    <h1
      class="p-10 text-xl mx-auto"
      v-if="isAuthenticated"
    >
      Successfully logged in!
    </h1>
    <form
      class="bg-gray-100 flex flex-col justify-center"
      v-else
      @submit.prevent="submit"
    >
      <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div class="px-5 py-7">
            <label class="font-semibold text-sm text-gray-600 pb-1 block"
              >E-mail</label
            >
            <input
              type="text"
              class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              id="email"
              v-model="email"
              aria-label="email"
            />
            <label class="font-semibold text-sm text-gray-600 pb-1 block"
              >Password</label
            >
            <input
              class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              id="password"
              v-model="password"
              aria-label="password"
              type="password"
            />
            <button
              class="transition duration-200 bg-gray-500 hover:bg-gray-600 focus:bg-gray-700 focus:shadow-sm focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              :disabled="!(email && password)"
              type="submit"
            >
              <span class="inline-block mr-2">Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-4 h-4 inline-block"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>



<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      //TODO remove later
      email: "peter@widerstand-der-pinguine.ev",
      password: "peter1",
      error: "",
    };
  },
  computed: mapGetters("auth", ["isAuthenticated"]),
  methods: {
    ...mapActions("auth", ["login"]),
    async submit() {
      try {
        const success = await this.login({
          email: this.email,
          password: this.password,
        });
        if (success) this.error = "";
        else this.error = "Incorrect email/password!";
      } catch (err) {
        this.error = "Internal ERROR: Something went wrong!";
      }
    },
  },
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
