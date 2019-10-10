import { SIGNIN_USER, GET_CURRENT_USER, SIGNUP_USER } from "../queries";
import { defaultClient as apolloClient } from "../main";

export const signinUserService = async payload => {
  const response = await apolloClient.mutate({
    mutation: SIGNIN_USER,
    variables: payload
  });
  return response;
};

export const getCurrentUserService = async () => {
  const response = await apolloClient.query({
    query: GET_CURRENT_USER
  });

  return response;
};

export const signupUserservice = async payload => {
  const response = await apolloClient.mutate({
    mutation: SIGNUP_USER,
    variables: payload
  });

  return response;
};

export const signOutUserService = async () => {
  return await apolloClient.resetStore();
};
