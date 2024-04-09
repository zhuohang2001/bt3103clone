<template>
	<div id="container">
		<div id="FirstDiv">
			<h1 id="Username">@{{ username }}</h1>
			<button class="signout-button" type="button" v-on:click="signOut">
				Logout
			</button>
		</div>
		<div id="SecondDiv">
			<div id="details">
				<img :src="profilePhoto" alt="Profile Photo" id="profile-photo" />
				<div id="user-info">
					<div id="user-joined">Joined {{ dateJoined }}</div>
					<div id="user-telegram">Telegram @{{ telegramHandle }}</div>
				</div>
				<div id="user-rating">
					<div id="overall-rating">
						{{ averageRating.toFixed(1) }} ({{ numberOfRatings }} ratings)
					</div>
					<div class="stars">
						<!-- include method to return the correct number of filled stars based on the rating -->
						<span
							class="star"
							v-for="i in 5"
							:key="i"
							:class="{ filled: i <= averageRating }"
							>&#9733;</span
						>
					</div>
				</div>
			</div>
			<div id="ratings" class="scroll">
				<div v-for="(rating, index) in ratings" :key="index">
					<Rating
						:profilePhoto="profilePhoto"
						:ratedByUsername="rating.RatedByUsername"
						:ratingValue="rating.RatingValue"
						:ratingComment="rating.RatingComment"
					/>
				</div>
			</div>
		</div>

		<div id="ThirdDiv">
			<h1 id="EditDetails">Edit Details</h1>
		</div>
		<div id="FourthDiv">
			<p>to edit profile details</p>
			<input type="file" @change="handleFileUpload" />
			<button @click="uploadFile">Upload</button>
		</div>
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
	</div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from "firebase/firestore";
import Rating from "../components/profile_components/Rating.vue";

export default {
	name: "Profile",
	components: { Rating },
	data() {
		return {
			username: "",
			ratings: [],
			profilePhoto: "/images/logo_with_words.png",
			dateJoined: "",
			telegramHandle: "",
			averageRating: 0,
			numberOfRatings: 0,
		};
	},
	methods: {
		async fetchUserData() {
			const user = this.$root.user;
			if (user) {
				const db = getFirestore();
				const userDocRef = doc(db, "Users", user.uid);
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					this.username = userData.username;
					this.telegramHandle = userData.telegramHandle;
				} else {
					console.error("User document does not exist for:", user.uid);
				}
				this.dateJoined = new Date(
					user.metadata.creationTime
				).toLocaleDateString("en-GB");
				await this.fetchRatings();
			} else {
				console.log("No user found");
			}
		},
		async fetchRatings() {
			try {
				const db = getFirestore();
				const ratingsRef = collection(db, "Ratings");
				const userRatingsQuery = query(
					ratingsRef,
					where("RatedUsername", "==", this.username)
				);
				const querySnapshot = await getDocs(userRatingsQuery);
				let totalRatings = 0;
				this.ratings = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					totalRatings += data.RatingValue;
					return data;
				});
				this.numberOfRatings = this.ratings.length;
				if (this.numberOfRatings > 0) {
					this.averageRating = totalRatings / this.numberOfRatings;
				}
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
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.$root.user = user;
				this.fetchUserData();
			} else {
				console.log("No user found");
			}
		});
		/* const auth = getAuth();
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				// If user is signed in
				const db = getFirestore();
				const userDocRef = doc(db, "Users", user.uid);
				try {
					const userDocSnapshot = await getDoc(userDocRef);
					if (userDocSnapshot.exists()) {
						// If user document exists
						const userData = userDocSnapshot.data();
						this.username = userData.username;
						console.log("Username:", this.username);
						await this.fetchRatings();
					} else {
						console.error("User document does not exist for:", user.uid);
					}
				} catch (error) {
					console.error("Error fetching user document:", error);
				}
			} else {
				// If user is signed out
				console.log("User signed out");
			}
		}); */
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

#ratings {
	display: flex;
	flex-direction: row;
	gap: 20px;
	padding: 20px 0;
}

.scroll {
	margin: 4px, 4px;
	padding: 4px;
	overflow-x: auto;
	overflow-y: hidden;
	white-space: nowrap;
}

#profile-photo {
	height: 80px; /*kiv*/
}
</style>
