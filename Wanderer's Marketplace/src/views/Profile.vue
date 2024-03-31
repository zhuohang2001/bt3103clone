<template>
	<div>
	  <h1>This is the Profile Page</h1>
	  <div id="nav-links">
		<router-link to="/listingcompleted">
		  Temporary link to ListingCompleted
		</router-link>
	  </div>
	  <button @click="signOut">Sign Out</button>
	</div>
  </template>
  
  <script>
  import { getAuth, signOut } from "firebase/auth";
  
  export default {
	name: "Profile",
	methods: {
	  signOut() {
		const auth = getAuth();
		signOut(auth)
		  .then(() => {
			console.log("User signed out");
			// Reset the user variable to null after sign-out
			this.$root.user = null;
			this.$router.push('/'); // Redirect to home page
		  })
		  .catch((error) => {
			console.error("Error signing out:", error);
		  });
	  },
	},
  };
  </script>
  