import Vue from "vue";
import Vuetify from "vuetify/lib";
import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    primary: "#03a9f4",
    secondary: "#cddc39",
    accent: "#ff5722",
    error: "#f44336",
    warning: "#2196f3",
    info: "#00bcd4",
    success: "#4caf50"
  },
  icons: {
    iconfont: "md"
  }
});
