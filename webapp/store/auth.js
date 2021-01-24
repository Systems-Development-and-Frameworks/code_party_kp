import { SET_TOKEN } from ".";
import { gql } from "@apollo/client";
import jwt_decode from "jwt-decode";

export const state = () => ({
  //JWT token
  token: null
});
export const getters = {
  isAuthenticated: state => {
    return !!state.token;
  },
  currentUser: state => {
    const decoded = jwt_decode(state.token);
    return decoded.id;
  }
};

export const mutations = {
  [SET_TOKEN](state, token) {
    state.token = token;
  }
};

export const actions = {
  async login({ commit }, { email, password }) {
    try {
      const loginGql = gql`
        mutation($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `;
      const response = await this.app.apolloProvider.defaultClient.mutate({
        mutation: loginGql,
        variables: {
          email,
          password
        }
      });

      const token = response.data.login;

      this.$apolloHelpers.onLogin(token);
      commit(SET_TOKEN, token);
      return true;
    } catch (err) {
      if (
        err.message ===
          "GraphQL error: There is no user registered with this Email!" ||
        err.message === "GraphQL error: Password did not match!"
      ) {
        return false;
      } else throw err;
    }
  },
  logout({ commit }) {
    this.$apolloHelpers.onLogout();
    commit(SET_TOKEN, null);
  }
};
