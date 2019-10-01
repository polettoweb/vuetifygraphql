import Vue from "vue";
import Vuex from "vuex";
import { defaultClient as apolloClient } from "./main";
import { GET_POSTS, SIGNIN_USER } from "./queries";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    }
  },
  actions: {
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
    signinUser: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.signinUser);
          localStorage.setItem("token", data.signinUser.token);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
});
