const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    async getCurrentUser(_, args, { User, currentUser }) {
      if (!currentUser) {
        return null;
      }

      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Post"
      });
      return user;
    },
    async getPosts(_, args, { Post }) {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    },
    async getUserPosts(_, { userId }, { Post }) {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    async getPost(_, { postId }, { Post }) {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User"
      });

      return post;
    },
    async searchPosts(_, { searchTerm }, { Post }) {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // Assign 'searchTerm' a text score to provide best match
          { score: { $meta: "textScore" } }
          // Sort results according to that textScore (as well as by likes in descending order)
        )
          .sort({
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);
        return searchResults;
      }
    },
    async infiniteScrollPosts(_, { pageNum, pageSize }, { Post }) {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        //if page number is greater than 1
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return {
        posts,
        hasMore
      };
    }
  },
  Mutation: {
    async addPost(
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    async updateUserPost(
      _,
      { postId, userId, title, description, imageUrl, categories },
      { Post }
    ) {
      const post = await Post.findOneAndUpdate(
        //find the post by postid and created by
        { _id: postId, createdBy: userId },
        {
          $set: {
            title,
            imageUrl,
            categories,
            description
          }
        },
        { new: true }
      );
      return post;
    },
    async deleteUserPost(_, { postId }, { Post }) {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    async addPostMessage(_, { messageBody, userId, postId }, { Post }) {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const post = await Post.findOneAndUpdate(
        // find post by id
        { _id: postId },
        // prepend (push) new message to beginning of messages array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post.messages[0];
    },
    async likePost(_, { postId, username }, { Post, User }) {
      //find Post, add 1 to its like value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      //find user and add id of post to its favorites array and populate it
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });

      return { likes: post.likes, favorites: user.favorites };
    },
    async unlikePost(_, { postId, username }, { Post, User }) {
      //find Post, add -1 to its like value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      //find user and remove id of post to its favorites array and populate it
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });

      return { likes: post.likes, favorites: user.favorites };
    },
    async signinUser(_, { username, password }, { User }) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    async signupUser(_, { username, email, password }, { User }) {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
