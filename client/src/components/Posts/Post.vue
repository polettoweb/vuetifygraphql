<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn @click="handleToggleLike" large icon v-if="user">
              <v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin subtitle-1">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <template v-slot:activator="{on}">
              <v-img @click="toggleImageDialog" :src="getPost.imageUrl" id="post__image" />
            </template>
          </v-tooltip>

          <!-- Post Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3 mx-1" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form v-model="isFormValid" ref="form" @submit.prevent="handleAddPostMessage">
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="messageBody"
                  :rules="messageRules"
                  clearable
                  :append-outer-icon="messageBody && 'send'"
                  @click:append-outer="handleAddPostMessage"
                  label="Add Message"
                  type="text"
                  prepend-icon="email"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-item inset :key="message.title">
                <v-list-item-avatar>
                  <v-img :src="message.messageUser.avatar" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{message.messageBody}}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{message.messageUser.username}}
                    <span
                      class="grey--text text--lighten-1 hidden-xs-only"
                    >{{getTimeFromNow(message.messageDate)}}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="hidden-xs-only">
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST } from "@/queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      postLiked: false,
      dialog: false,
      messageBody: "",
      isFormValid: true,
      messageRules: [
        message => !!message || "Message is required",
        message =>
          (message && message.length < 75) ||
          "Message must be less than 75 characters"
      ]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    checkIfPostLiked(postId) {
      // check if user favorites includes post with id of 'postId'
      if (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === postId)
      ) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    async handleLikePost() {
      try {
        const variables = {
          postId: this.postId,
          username: this.user.username
        };
        const response = await this.$apollo.mutate({
          mutation: LIKE_POST,
          variables,
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        });
        const { data } = response;
        const updatedUser = {
          ...this.user,
          favorites: data.likePost.favorites
        };
        this.$store.commit("setUser", updatedUser);
      } catch (err) {
        console.log(err);
      }
    },
    async handleUnlikePost() {
      try {
        const variables = {
          postId: this.postId,
          username: this.user.username
        };
        const response = await this.$apollo.mutate({
          mutation: UNLIKE_POST,
          variables,
          update: cache => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        });
        const { data } = response;
        const updatedUser = {
          ...this.user,
          favorites: data.unlikePost.favorites
        };
        this.$store.commit("setUser", updatedUser);
      } catch (err) {
        console.log(err);
      }
    },
    async handleAddPostMessage() {
      try {
        if (this.$refs.form.validate()) {
          const variables = {
            messageBody: this.messageBody,
            userId: this.user._id,
            postId: this.postId
          };
          const response = await this.$apollo.mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.messages.unshift(addPostMessage);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          });
          const { data } = response;
          this.$refs.form.reset();
        }
      } catch (err) {
        console.error(err);
      }
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
