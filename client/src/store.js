import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import { defaultClient as apolloClient } from "./main";
import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER } from "./queries";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    }
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
        console.log(data.getPosts);
      } catch (err) {
        commit("setLoading", false);
        console.log(err);
      }
    },
    async signinUser({ commit }, payload) {
      try {
        const response = await apolloClient.mutate({
          mutation: SIGNIN_USER,
          variables: payload
        });
        const { data } = response;
        // console.log(data.signinUser);
        localStorage.setItem("token", data.signinUser.token);
        router.go();
      } catch (err) {
        console.error(err);
      }
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user
  }
});
