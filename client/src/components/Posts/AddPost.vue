<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Add Post</h1>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">
          <!-- Title input -->
          <v-layout row px-8 py-2>
            <v-flex xs12>
              <v-text-field
                v-model="title"
                :rules="titleRules"
                label="Post Title"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image url input input -->
          <v-layout row px-8 py-2>
            <v-flex xs12>
              <v-text-field
                v-model="imageUrl"
                :rules="imageRules"
                label="Image URL"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image preview -->
          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl" alt height="300px" />
            </v-flex>
          </v-layout>

          <!-- categories select -->
          <v-layout row px-8 py-2>
            <v-flex xs12>
              <v-select
                v-model="categories"
                :rules="categoriesRules"
                :items="['Art', 'Education','Travel','Food', 'Forniture', 'Photography', 'Technology']"
                multiple
                label="Categories"
              ></v-select>
            </v-flex>
          </v-layout>

          <!-- Title input -->
          <v-layout row px-8 py-2>
            <v-flex xs12>
              <v-textarea
                v-model="description"
                :rules="descRules"
                label="Description"
                type="text"
                required
              ></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row pa-2 flex flex-column align-end>
            <v-btn
              :loading="loading"
              :disabled="!isFormValid || loading"
              color="info"
              x-large
              type="submit"
              class="mb-4"
            >
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </template>Submit
            </v-btn>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length > 0 || "At least one categories is required"
      ],
      descRules: [
        desc => !!desc || "Description is required",
        title =>
          title.length < 200 || "Description must have less than 200 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "user"])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          description: this.description,
          categories: this.categories,
          creatorId: this.user._id
        });
        this.$router.push("/");
      }
    }
  }
};
</script>

<style>
</style>