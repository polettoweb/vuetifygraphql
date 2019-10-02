import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
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
  onError: ({ graphQlErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }

    if (graphQlErrors) {
      for (let err of graphQlErrors) {
        console.dir(err);
      }
    }
  }
});

const ApolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: ApolloProvider.provide(),
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
