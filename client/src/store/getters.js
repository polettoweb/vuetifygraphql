const posts = state => state.posts;
const userPosts = state => state.userPosts;
const loading = state => state.loading;
const searchResults = state => state.searchResults;
const user = state => state.user;
const error = state => state.error;
const authError = state => state.authError;
const userFavorites = state => state.user && state.user.favorites;

export default {
  posts,
  userPosts,
  loading,
  searchResults,
  user,
  error,
  authError,
  userFavorites
};
