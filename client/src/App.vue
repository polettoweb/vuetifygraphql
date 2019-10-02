<template>
  <v-app style="background: #e3e3ee">
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat class="pa-0">
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">Vuetify Test</h1>
        </router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="item in sideNavItems" :key="item.title" ripple :to="item.link">
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- signout vutton -->
        <v-list-item v-if="user">
          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Signout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div>
      <v-toolbar color="primary" dark>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <!-- <v-toolbar-title class="hidden-sm-only"> -->
        <router-link to="/" tag="span" style="cursor: pointer">
          <v-img
            src="./assets/sm.svg"
            position="top center"
            width="82"
            height="62"
            aspect-ratio="1.3225"
          />
        </router-link>
        <!-- </v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-text-field
          flex
          prepend-icon="search"
          placeholder="Search posts"
          color="accent"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
            <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
            {{item.title}}
          </v-btn>
          <!-- Profile button -->
          <v-btn text to="/profile" v-if="user">
            <v-icon class="hidden-sm-only" left>account_box</v-icon>
            <v-badge right color="accent" dark>
              <!-- <span slot="badge" primary>1</span> -->
              Profile
            </v-badge>
          </v-btn>
          <!-- Signout button -->
          <v-btn text v-if="user">
            <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>Signout
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <main>
        <v-container class="mt-4">
          <transition name="fade">
            <router-view />
          </transition>
        </v-container>
      </main>
    </div>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  data() {
    return {
      sideNav: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
      }

      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }

      return items;
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    }
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-ative {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateX(-25px);
}
</style>
