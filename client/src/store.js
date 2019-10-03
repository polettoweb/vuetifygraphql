import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import { defaultClient as apolloClient } from "./main";
import {
  GET_CURRENT_USER,
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER
} from "./queries";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setAuthError(state, payload) {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null)
  },
  actions: {
    async getCurrentUser({ commit }) {
      try {
        commit("setLoading", true);
        const response = await apolloClient.query({
          query: GET_CURRENT_USER
        });
        const { data } = response;
        commit("setLoading", false);
        //add user data to state
        commit("setUser", data.getCurrentUser);
        console.log(data.getCurrentUser);
      } catch (err) {
        commit("setLoading", false);
        console.error(err);
      }
    },
    async getPosts({ commit }) {
      try {
        commit("setLoading", true);
        const response = await apolloClient.query({
          query: GET_POSTS
        });
        const { data } = response;
        commit("setPosts", data.getPosts);
        commit("setLoading", false);
      } catch (err) {
        commit("setLoading", false);
        console.log(err);
      }
    },
    async signinUser({ commit }, payload) {
      try {
        commit("clearError");
        commit("setLoading", true);
        localStorage.setItem("token", "");
        const response = await apolloClient.mutate({
          mutation: SIGNUP_USER,
          variables: payload
        });
        const { data } = response;
        // console.log(data.signinUser);
        commit("setLoading", false);
        localStorage.setItem("token", data.signinUser.token);
        router.go();
      } catch (err) {
        commit("setLoading", false);
        commit("setError", err);
        console.error(err);
      }
    },
    async signinUser({ commit }, payload) {
      try {
        commit("clearError");
        commit("setLoading", true);
        localStorage.setItem("token", "");
        const response = await apolloClient.mutate({
          mutation: SIGNIN_USER,
          variables: payload
        });
        const { data } = response;
        // console.log(data.signinUser);
        commit("setLoading", false);
        localStorage.setItem("token", data.signinUser.token);
        router.go();
      } catch (err) {
        commit("setLoading", false);
        commit("setError", err);
        console.error(err);
      }
    },
    async signoutUser({ commit }) {
      //clear user in state
      commit("clearUser");
      //remove token in localStorage
      localStorage.setItem("token", "");
      //end session
      await apolloClient.resetStore();
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});
