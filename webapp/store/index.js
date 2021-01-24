export const SET_TOKEN = "SET_TOKEN";
export const SET_USER = "SET_USER";

import cookie from "cookie";

export const actions = {
  //reads token from cookie(if present)
  //once nuxt server is started
  nuxtServerInit(store, context) {
    const { req } = context.ssrContext;
    if (!req) return; // static site generation
    //not yet set
    if (!req.headers.cookie) return;
    const parsedCookies = cookie.parse(req.headers.cookie);
    const token = parsedCookies["apollo-token"];
    if (!token) return;
    store.commit("auth/" + SET_TOKEN, token);
  }
};
