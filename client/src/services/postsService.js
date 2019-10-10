import {
  GET_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  SEARCH_POSTS
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
