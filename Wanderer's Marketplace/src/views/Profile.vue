<template>
	<div id="container">
		<div id="FirstDiv">
			<h1 id="Username">username to be displayed here</h1>
			<button class="signout-button" type="button" v-on:click="signOut">
				Logout
			</button>
		</div>
		<div id="SecondDiv" class="scroll">to show ratings</div>
		<div id="ThirdDiv">
			<h1 id="EditDetails">Edit Details</h1>
		</div>
		<div id="FourthDiv" class="scroll">to edit profile details</div>
	</div>
	<div>
		<div id="nav-links">
			<router-link to="/listingcompleted">
				Temporary link to ListingCompleted
			</router-link>
			<router-link to="/leaverating">
				Temporary link to LeaveRating
			</router-link>
		</div>
		<!-- Iterate over ratings and display each one -->
		<div v-for="(rating, index) in ratings" :key="index">
			<Rating
				:profilePhoto="profilePhoto"
				:ratedByUsername="rating.RatedByUsername"
				:ratingValue="rating.RatingValue"
				:ratingComment="rating.RatingComment"
			/>
		</div>
	</div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import Rating from "../components/profile_components/Rating.vue";

export default {
	name: "Profile",
	components: { Rating },
	data() {
		return {
			profilePhoto: "path/to/profile/photo.jpg",
			ratings: [], // Array to store fetched ratings
		};
	},
	methods: {
		async fetchRatings() {
			try {
				const db = getFirestore();
				const ratingsRef = collection(db, "Ratings");
				const userRatingsQuery = query(
					ratingsRef,
					where("RatedUsername", "==", "John Doe")
				); // kiv, Change to the username of the current user
				const querySnapshot = await getDocs(userRatingsQuery);
				this.ratings = querySnapshot.docs.map((doc) => doc.data());
			} catch (error) {
				console.error("Error fetching ratings:", error);
			}
		},
		signOut() {
			const auth = getAuth();
			signOut(auth)
				.then(() => {
					console.log("User signed out");
					this.$root.user = null;
					this.$router.push("/");
				})
				.catch((error) => {
					console.error("Error signing out:", error);
				});
		},
	},
	mounted() {
		this.fetchRatings();
	},
};
</script>

<style scoped>
#container {
	display: flex;
	flex-direction: column;
}

#FirstDiv,
#ThirdDiv {
	background-color: #051e55;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
}

#SecondDiv,
#FourthDiv {
	height: 360px;
	display: flex;
	justify-content: left;
	align-items: center;
}

h1 {
	color: white;
	margin-bottom: 18px;
}

.signout-button {
	background-color: #fff1e7;
	font-size: 20px;
	padding: 4px 20px;
	border-radius: 12px;
	border: none;
	display: inline-block;
	text-align: center;
	transition: all 0.5s;
	cursor: pointer;
	margin: 5px;
}
</style>
