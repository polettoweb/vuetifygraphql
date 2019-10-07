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
        <v-list-item v-if="user" @click="handleSignoutUser">
          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Signout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div>
      <v-app-bar color="primary" dark>
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
          v-model="searchTerm"
          @input="handleSearchPosts"
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
            <v-badge right color="accent" dark :class="{'bounce': badgeAnimated}">
              <span slot="badge" v-if="userFavorites.length" primary>{{userFavorites.length}}</span>
              Profile
            </v-badge>
          </v-btn>
          <!-- Signout button -->
          <v-btn text v-if="user" @click="handleSignoutUser">
            <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>Signout
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <!-- Search results card -->
      <v-card dark v-if="searchTerm && searchResults.length" id="search_card">
        <v-list>
          <v-list-item
            @click="gotToSearchResult(result._id)"
            v-for="result in searchResults"
            :key="result._id"
          >
            <v-list-item-title>
              {{result.title}} -
              <span
                class="font-weight-thin"
              >{{formatDescription(result.description)}}</span>
            </v-list-item-title>
            <!-- show icon if varoitre by user -->
            <v-list-item-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
      <main>
        <v-container class="mt-4">
          <transition name="fade">
            <router-view />
          </transition>
          <!-- Auth snackbar -->
          <v-snackbar :value="authSnackbar" color="success" :timeout="5000" bottom left>
            <v-icon class="mr-3">check_circle</v-icon>
            <h3>You are now signed in!</h3>
            <v-btn dark text @click="authSnackbar = false">Close</v-btn>
          </v-snackbar>

          <!-- Auth Error snackbar -->
          <v-snackbar
            v-if="authError"
            v-model="authErrorSnackbar"
            color="info"
            :timeout="5000"
            bottom
            left
          >
            <v-icon class="mr-3">cancel</v-icon>
            <h3>{{authError.message}}</h3>
            <v-btn dark text to="/signin">Signin</v-btn>
          </v-snackbar>
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
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false,
      searchTerm: ""
    };
  },
  watch: {
    user(newValue, oldValue) {
      //if we have no prev value for user, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      //if this value changes
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["authError", "user", "userFavorites", "searchResults"]),
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
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    gotToSearchResult(resultId) {
      this.searchTerm = "";
      this.$router.push(`/posts/${resultId}`);
      this.$store.commit("clearSearchResults");
    },
    formatDescription(desc) {
      return desc.length > 20 ? `${desc.slice(0, 20)}...` : desc;
    },
    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)
      );
    },
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

#search_card {
  position: absolute;
  width: 100vw;
  z-index: 100;
  top: 64px;
  left: 0;
}

.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    text-replace: translate3d(0, -20px, 0);
  }

  70% {
    transform: translate3d(0, -10px, 0);
  }

  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
