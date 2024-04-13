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
		<div v-if="showCropperModal" class="cropper-modal">
			<img ref="imageElement" style="max-width: 100%" />
			<div class="cropper-buttons">
				<button @click="getCroppedImageAndUpload">Upload</button>
				<button @click="cancelCropping">Cancel</button>
			</div>
		</div>
		<div id="FourthDiv">
			<p>to edit profile details</p>
			<button @click="triggerFileInput" class="edit-photo-button">
				Edit Profile Photo
			</button>
			<input
				type="file"
				id="inputImage"
				@change="handleFileChange"
				class="hidden"
				ref="fileInput"
				accept="image/*"
			/>
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
	updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Rating from "../components/profile_components/Rating.vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

export default {
	name: "Profile",
	components: { Rating },
	data() {
		return {
			username: "",
			ratings: [],
			profilePhoto: "",
			dateJoined: "",
			telegramHandle: "",
			averageRating: 0,
			numberOfRatings: 0,
			showCropperModal: false,
			cropper: null,
			croppedImage: null,
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
					this.profilePhoto = userData.profilePhoto;
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
		triggerFileInput() {
			this.$refs.fileInput.click();
		},
		handleFileChange(event) {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					this.showCropperModal = true;
					this.$nextTick(() => {
						this.cropper = new Cropper(this.$refs.imageElement, {
							aspectRatio: 1,
							viewMode: 1,
						});
						this.cropper.replace(e.target.result);
					});
				};
				reader.readAsDataURL(file);
			}
		},
		getCroppedImageAndUpload() {
			if (this.cropper) {
				const originalFile = this.$refs.fileInput.files[0];
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					const file = new File([blob], originalFile.name, {
						type: originalFile.type,
					});
					await this.uploadCroppedImage(file);
					this.showCropperModal = false;
					this.resetFileInput();
				}, originalFile.type);
			}
		},

		async uploadCroppedImage(file) {
			try {
				const storage = getStorage();
				const storageRef = ref(
					storage,
					`profile-photos/${this.$root.user.uid}/${file.name}`
				);
				const uploadTask = await uploadBytes(storageRef, file);
				const downloadURL = await getDownloadURL(uploadTask.ref);
				this.profilePhoto = downloadURL;

				const db = getFirestore();
				await updateDoc(doc(db, "Users", this.$root.user.uid), {
					profilePhoto: downloadURL,
				});

				console.log("File uploaded successfully:", downloadURL);
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		},
		cancelCropping() {
			this.showCropperModal = false;
			this.resetFileInput();
		},
		resetFileInput() {
			this.$refs.fileInput.value = ""; // Reset the file input
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
	width: 200px; /* or any size */
	height: 200px;
	object-fit: cover; /* This will cover the area without stretching the image */
}

.cropper-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
	padding: 50px;
}

.cropper-modal img {
	box-shadow: 0 0 10px rgba(255, 255, 255, 0.85);
	border-radius: 4px;
	max-height: 80vh; /* Adjust this to ensure it fits in small screens */
	max-width: 95%;
}

.cropper-buttons {
	background-color: #4caf50;
	color: white;
	padding: 12px 24px;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	margin-top: 12px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.cropper-buttons:hover {
	background-color: #45a049;
}

.edit-photo-button {
	background-color: #4caf50;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
}

.hidden {
	display: none;
}
</style>
