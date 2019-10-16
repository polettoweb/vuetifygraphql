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
console.log('================================================')
console.log(process.env.NODE_ENV)
console.log('================================================')
Sentry.init({
  dsn: 'https://d8bddaffe00d4a5b8d07793a98c808ae@sentry.io/1781240',
  integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
});

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
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }

    if (graphQLErrors) {
      graphQLErrors.map(({ message }) => {
        Sentry.captureException(message);
      });
      for (let err of graphQLErrors) {
        console.dir(err);
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
