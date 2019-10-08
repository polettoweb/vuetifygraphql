import Vue from "vue";
import Vuex from "vuex";

import actions from "./actions";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    loading: state => state.loading,
    searchResults: state => state.searchResults,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError,
    userFavorites: state => state.user && state.user.favorites
  },
  mutations,
  actions
});
