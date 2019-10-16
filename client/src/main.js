import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/";
import vuetify from "./plugins/vuetify";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import FormAlert from "./components/Shared/FormAlert";

// Register global component
Vue.component("form-alert", FormAlert);
const isProd = (process.env.NODE_ENV === 'production') ? true : false

if (isProd) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY,
    integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
  });
}

Vue.use(VueApollo);
export const defaultClient = new ApolloClient({
  uri: "https://vuetifygraphql.herokuapp.com/graphql",
  //include auth token
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }

    //operation adds the token to an authorization header, which is sent to the backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors }) => {
    if (graphQLErrors) {

      for (let err of graphQLErrors) {
        Sentry.captureException(err);
        if (err.name === "AuthenticationError") {
          // set auth error in state (to show in snackbar)
          store.commit("setAuthError", err);
          // signout user (to clear token)
          store.dispatch("signoutUser");
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
