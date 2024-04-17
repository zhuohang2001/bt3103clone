import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/store.js";

const app = createApp(App);
app.use(store);
app.use(router);
store.dispatch("initializeAuth");
app.mount("#app");
