<template>
	<div>
		<h1>This is the Profile Page</h1>
		<div id="nav-links">
			<router-link to="/listingcompleted">
				Temporary link to ListingCompleted
			</router-link>
			<router-link to="/leaverating">
				Temporary link to LeaveRating
			</router-link>
		</div>
		<button @click="signOut">Sign Out</button>
		<Rating
			:profilePhoto="profilePhoto"
			:ratedByUsername="ratedByUsername"
			:ratingValue="ratingValue"
			:ratingComment="ratingComment"
		/>
	</div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import Rating from "../components/profile_components/Rating.vue";

export default {
	name: "Profile",
	components: { Rating },
	data() {
		return {
			// sample data
			profilePhoto: "path/to/profile/photo.jpg",
			ratedByUsername: "JohnDoe",
			ratingValue: 4,
			ratingComment: "Great experience!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
		};
	},
	methods: {
		signOut() {
			const auth = getAuth();
			signOut(auth)
				.then(() => {
					console.log("User signed out");
					// Reset the user variable to null after sign-out
					this.$root.user = null;
					this.$router.push("/"); // Redirect to home page
				})
				.catch((error) => {
					console.error("Error signing out:", error);
				});
		},
	},
};
</script>
