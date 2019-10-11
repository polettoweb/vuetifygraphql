import {
  GET_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  SEARCH_POSTS,
  ADD_POST,
  INFINITE_SCROLL_POSTS
} from "../queries";

import { defaultClient as apolloClient } from "../main";

export const getPostsService = async () => {
  const response = await apolloClient.query({
    query: GET_POSTS
  });
  return response;
};

export const getUserPostsService = async payload => {
  const response = await apolloClient.query({
    query: GET_USER_POSTS,
    variables: payload
  });
  return response;
};

export const updateUserPostService = async payload => {
  const response = await apolloClient.mutate({
    mutation: UPDATE_USER_POST,
    variables: payload
  });

  return response;
};

export const deleteUserPostService = async payload => {
  const response = await apolloClient.mutate({
    mutation: DELETE_USER_POST,
    variables: payload
  });

  return response;
};

export const searchPostsService = async payload => {
  const response = await apolloClient.query({
    query: SEARCH_POSTS,
    variables: payload
  });

  return response;
};

export const addPostService = async (state, payload) => {
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
  return response;
};
