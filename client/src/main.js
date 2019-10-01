import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

Vue.use(VueApollo)
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

const ApolloProvider = new VueApollo({ defaultClient})

Vue.config.productionTip = false

new Vue({
  provide: ApolloProvider.provide(),
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
