<template>
	<div id="app">
		<div id="nav" v-if = "user && !isLoginPage">
			<img id="LogoTopLeft" src="/images/logo_with_words_2.png" alt="" />
			<div id="nav-links">
				<router-link to="/home"> Home </router-link> |
				<router-link to="/marketplace"> Marketplace </router-link> |
				<router-link to="/profile"> Profile </router-link>
			</div>
		</div>
		<div id="content">
			<router-view />
		</div>
	</div>
</template>

<script>
import {onAuthStateChanged, getAuth} from "firebase/auth";

export default {
	name: "App",
	data() {
		return {
			user: false,
      isLoginPage: false
		};
	},
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      }
    })  
    // Check if the current route is the login page
    this.isLoginPage = this.$route.path === '/'; 
  },
  watch: {
    $route(to) {
      // Update isLoginPage when the route changes
      this.isLoginPage = to.path === "/";
    }
  }
};


</script>

<style>
#LogoTopLeft {
	height: 80px;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
	background-color: #b3e3eb;
}

#nav {
	padding: 10px;
	height: 80px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #051e55;
	background-color: #ffffff;
	position: fixed;
	top: 0;
	width: calc(100% - 20px);
}

#nav-links {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

#nav a {
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	font-weight: bold;
	color: #051e55;
}

#content {
	flex: 1;
	padding-top: 80px;
}

body {
	margin: 0;
}
</style>
