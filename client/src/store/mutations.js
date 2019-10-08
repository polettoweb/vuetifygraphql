const setPosts = (state, payload) => {
  state.posts = payload;
};

const setUser = (state, payload) => {
  state.user = payload;
};
const setUserPosts = (state, payload) => {
  state.userPosts = payload;
};
const setLoading = (state, payload) => {
  state.loading = payload;
};
const setSearchResults = (state, payload) => {
  if (payload !== null) {
    state.searchResults = payload;
  }
};
const setError = (state, payload) => {
  state.error = payload;
};
const setAuthError = (state, payload) => {
  state.authError = payload;
};
const clearUser = state => (state.user = null);
const clearError = state => (state.error = null);
const clearSearchResults = state => (state.searchResults = []);
export default {
  setPosts,
  setUser,
  setUserPosts,
  setLoading,
  setSearchResults,
  setError,
  setAuthError,
  clearError,
  clearUser,
  clearSearchResults
};
