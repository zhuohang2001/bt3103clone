<template>
	<div id="rating">
		<h1>Leave Rating</h1>
		<div class="rating-stars">
			<span
				v-for="star in 5"
				:key="star"
				@click="setRating(star)"
				:class="{ filled: star <= selectedRating }"
			>
				&#9733;
			</span>
		</div>
		<input
			type="text"
			id="comment"
			v-model="ratingComment"
			placeholder="Leave a comment (optional)"
		/>
		<button id="submit" type="button" v-on:click="leaveRating">Submit</button>
	</div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
	name: "LeaveRating",
	data() {
		return {
			ratedUsername: "John Doe", //kiv
			ratedByUsername: "Betty", //kiv
			selectedRating: 0,
			ratingComment: "",
		};
	},
	methods: {
		setRating(value) {
			this.selectedRating = this.selectedRating === value ? 0 : value;
			this.updateStarColors();
		},
		updateStarColors() {
			const stars = document.querySelectorAll(".rating-stars span");
			stars.forEach((star, index) => {
				if (this.selectedRating > 0 && index < this.selectedRating) {
					star.style.color = "#051e55";
				} else {
					star.style.color = "#ccc";
				}
			});
		},
		async leaveRating() {
			try {
				const docRef = await addDoc(collection(db, "Ratings"), {
					RatedUsername: this.ratedUsername,
					RatedByUsername: this.ratedByUsername,
					RatingValue: this.selectedRating,
					RatingComment: this.ratingComment,
				});
				console.log("Document written with ID: ", docRef.id);
				this.selectedRating = 0;
				this.ratingComment = "";
				this.$emit("added");
				this.$router.push("/home");
			} catch (error) {
				console.error("Error adding document: ", error);
			}
		},
	},
	mounted() {
		this.updateStarColors();
	},
};
</script>

<style scoped>
.rating-stars {
	font-size: 24px;
}

.rating-stars span {
	cursor: pointer;
}

input {
	width: 100%;
	height: 100px;
	margin-top: 10px;
}
</style>
