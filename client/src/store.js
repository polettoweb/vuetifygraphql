import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import { defaultClient as apolloClient } from "./main";
import {
  GET_CURRENT_USER,
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from "./queries";
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
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setUserPosts(state, payload) {
      state.userPosts = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setSearchResults(state, payload) {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setError(state, payload) {
      state.error = payload;
    },
    setAuthError(state, payload) {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    clearSearchResults: state => (state.searchResults = [])
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
    async getUserPosts({ commit }, payload) {
      try {
        const response = await apolloClient.query({
          query: GET_USER_POSTS,
          variables: payload
        });

        const { data } = response;
        commit("setUserPosts", data.getUserPosts);
      } catch (err) {
        console.error(err);
      }
    },
    async updateUserPost({ state, commit }, payload) {
      try {
        const response = await apolloClient.mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        });
        const { data } = response;
        const index = state.userPosts.findIndex(
          post => post._id == data.updateUserPost._id
        );
        const userPosts = [
          ...state.userPosts.slice(0, index),
          data.updateUserPost,
          ...state.userPosts.slice(index + 1)
        ];
        commit("setUserPosts", userPosts);
      } catch (err) {
        console.error(err);
      }
    },
    async deleteUserPost({ state, commit }, payload) {
      try {
        const response = await apolloClient.mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        });
        const { data } = response;
        const index = state.userPosts.findIndex(
          post => post._id == data.deleteUserPost._id
        );
        const userPosts = [
          ...state.userPosts.slice(0, index),
          ...state.userPosts.slice(index + 1)
        ];
        commit("setUserPosts", userPosts);
      } catch (err) {
        console.error(err);
      }
    },
    async searchPosts({ commit }, payload) {
      try {
        const response = await apolloClient.query({
          query: SEARCH_POSTS,
          variables: payload
        });
        const { data } = response;
        commit("setSearchResults", data.searchPosts);
      } catch (err) {
        console.error(err);
      }
    },
    async signupUser({ commit }, payload) {
      try {
        commit("clearError");
        commit("setLoading", true);
        const response = await apolloClient.mutate({
          mutation: SIGNUP_USER,
          variables: payload
        });
        const { data } = response;
        // console.log(data.signinUser);
        commit("setLoading", false);
        localStorage.setItem("token", data.signupUser.token);
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
    },
    async addPost({ state, commit }, payload) {
      try {
        const response = await apolloClient.mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            //read the query to update
            const data = cache.readQuery({ query: GET_POSTS });
            //create updated data
            data.getPosts.unshift(addPost);
            //write update data back to the query
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          //optimistic response ensures data is added immediately as we specified for the update funmction
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
          //rerun specified queries after performing mutation in order to get fresh data
          refetchQueries: [
            {
              //updating posts page
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            },
            {
              //updating pofile page
              query: GET_USER_POSTS,
              variables: {
                userId: state.user._id
              }
            }
          ]
        });
        const { data } = response;
        console.log(data.post);
      } catch (err) {
        console.error(err);
      }
    }
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
  }
});
