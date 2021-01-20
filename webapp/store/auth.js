import { SET_USER, SET_TOKEN } from ".";
import { gql } from "@apollo/client";
import jwt_decode from "jwt-decode";
export const state = () => ({
  //JWT token
  token: null,
  //currently logged in user(id)
  currentUser: null
});
export const getters = {
  isAuthenticated: state => {
    return !!state.token;
  },
  currentUser(state) {
    return state.currentUser;
  },
};

export const mutations = {
  [SET_TOKEN](state, token) {
    state.token = token;
  },
  [SET_USER](state, user) {
    state.currentUser = user;
  }
};

export const actions = {
  async login({ commit }, { email, password }) {
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
    const decoded = jwt_decode(response.data.login);

    commit(SET_TOKEN, token);
    commit(SET_USER, decoded.id);
  },
  logout({ commit }) {
    commit(SET_TOKEN, null);
    commit(SET_USER, null);
  }
};
