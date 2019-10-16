import router from "../router";
import * as Sentry from '@sentry/browser';

import {
  signinUserService,
  getCurrentUserService,
  signupUserservice,
  signOutUserService
} from "../services/userService";

import {
  getPostsService,
  getUserPostsService,
  updateUserPostService,
  deleteUserPostService,
  searchPostsService,
  addPostService
} from "../services/postsService";

const isDev = (process.env.NODE_ENV === 'development') ? true : false
const getCurrentUser = async ({ commit }) => {
  try {
    commit("setLoading", true);
    const { data } = await getCurrentUserService();
    commit("setLoading", false);
    //add user data to state
    commit("setUser", data.getCurrentUser);
  } catch (err) {
    commit("setLoading", false);
    isDev && console.error(err)
  }
};

const getPosts = async ({ commit }) => {
  try {
    commit("setLoading", true);
    const { data } = await getPostsService();
    commit("setPosts", data.getPosts);
    commit("setLoading", false);
  } catch (err) {
    commit("setLoading", false);
    isDev && console.error(err)
    
  }
};

const getUserPosts = async ({ commit }, payload) => {
  try {
    const { data } = await getUserPostsService(payload);
    commit("setUserPosts", data.getUserPosts);
  } catch (err) {
    isDev && console.error(err)
  }
};

const updateUserPost = async ({ state, commit }, payload) => {
  try {
    const { data } = await updateUserPostService(payload);
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
    isDev && console.error(err)
  }
};

const deleteUserPost = async ({ state, commit }, payload) => {
  try {
    const { data } = await deleteUserPostService(payload);
    const index = state.userPosts.findIndex(
      post => post._id == data.deleteUserPost._id
    );
    const userPosts = [
      ...state.userPosts.slice(0, index),
      ...state.userPosts.slice(index + 1)
    ];
    commit("setUserPosts", userPosts);
  } catch (err) {
    isDev && console.error(err)
  }
};

const searchPosts = async ({ commit }, payload) => {
  try {
    const { data } = await searchPostsService(payload);
    commit("setSearchResults", data.searchPosts);
  } catch (err) {
    isDev && console.error(err)
  }
};

const signupUser = async ({ commit }, payload) => {
  try {
    commit("clearError");
    commit("setLoading", true);
    const { data } = await signupUserservice(payload);
    commit("setLoading", false);
    localStorage.setItem("token", data.signupUser.token);
    router.go();
  } catch (err) {
    commit("setLoading", false);
    commit("setError", err);
    isDev && console.error(err)
  }
};

const signinUser = async ({ commit }, payload) => {
  try {
    commit("clearError");
    commit("setLoading", true);
    const { data } = await signinUserService(payload);
    commit("setLoading", false);
    localStorage.setItem("token", data.signinUser.token);
    router.go();
  } catch (err) {
    commit("setLoading", false);
    commit("setError", err);
    isDev && console.error(err)
  }
};

const signoutUser = async ({ commit }) => {
  try {
    //clear user in state
    commit("clearUser");
    //remove token in localStorage
    localStorage.setItem("token", "");
    //end session
    await signOutUserService();
    router.push("/");
  } catch (err) {
    isDev && console.error(err)
  }
};

const addPost = async ({ state, commit }, payload) => {
  try {
    await addPostService(state, payload);
  } catch (err) {
    isDev && console.error(err)
  }
};

export default {
  getCurrentUser,
  getPosts,
  getUserPosts,
  updateUserPost,
  deleteUserPost,
  searchPosts,
  signinUser,
  signoutUser,
  signupUser,
  addPost
};
