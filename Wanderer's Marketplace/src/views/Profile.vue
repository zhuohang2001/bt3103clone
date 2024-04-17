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
			<h1 id="EditDetails">Edit User Details</h1>
		</div>
		<div id="FourthDiv">
			<div id="edit-profile-photo">
				<img
					:src="profilePhoto"
					alt="Current Profile"
					id="currentProfilePhoto"
					style="width: 100px; height: 100px"
				/>
				<br />
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
				<div v-if="showCropperModal" class="cropper-modal">
					<img ref="imageElement" style="max-width: 100%" />
					<div class="cropper-buttons">
						<button @click="getCroppedImageAndUpload" class="upload-button">
							Upload
						</button>
						<button @click="cancelCropping" class="cancel-button">
							Cancel
						</button>
					</div>
				</div>
			</div>
			<div id="edit-text-input">
				<label for="telegramHandle">Telegram Handle</label>
				<input
					type="text"
					id="telegramHandle"
					name="telegramHandle"
					v-model="telegramHandle"
					:class="{ edited: telegramHandleChanged }"
				/><br />

				<label for="cardholderName">Cardholder Name</label>
				<input
					type="text"
					id="cardholderName"
					name="cardholderName"
					v-model="cardholderName"
					:class="{ edited: cardholderNameChanged }"
				/><br />

				<label for="cardNumber">Card Number</label>
				<input
					type="text"
					id="cardNumber"
					name="cardNumber"
					v-model="cardNumber"
					:class="{ edited: cardNumberChanged }"
				/><br />

				<label for="CVV">CVV</label>
				<input
					type="text"
					id="CVV"
					name="CVV"
					v-model="CVV"
					:class="{ edited: CVVChanged }"
				/><br />

				<label for="expiryDate">Expiry Date</label>
				<input
					type="text"
					id="expiryDate"
					name="expiryDate"
					v-model="expiryDate"
					:class="{ edited: expiryDateChanged }"
				/><br />

				<button @click="confirmEdits" class="edit-details-button">
					Confirm Edits
				</button>
			</div>
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
const db = getFirestore();
const storage = getStorage();

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
			cardholderName: "",
			cardNumber: "",
			CVV: "",
			expiryDate: "",
			initialTelegramHandle: "",
			initialCardholderName: "",
			initialCardNumber: "",
			initialCVV: "",
			initialExpiryDate: "",
		};
	},
	methods: {
		async fetchUserData() {
			const user = this.$root.user;
			if (user) {
				const userDocRef = doc(db, "Users", user.uid);
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					this.username = userData.username;
					this.telegramHandle = userData.telegramHandle;
					this.profilePhoto = userData.profilePhoto;
					this.cardholderName = userData.cardholderName;
					this.cardNumber = userData.cardNumber;
					this.CVV = userData.CVV;
					this.expiryDate = userData.expiryDate;
					this.initialTelegramHandle = userData.telegramHandle;
					this.initialCardholderName = userData.cardholderName;
					this.initialCardNumber = userData.cardNumber;
					this.initialCVV = userData.CVV;
					this.initialExpiryDate = userData.expiryDate;
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
				const storageRef = ref(
					storage,
					`profile-photos/${this.$root.user.uid}/${file.name}`
				);
				const uploadTask = await uploadBytes(storageRef, file);
				const downloadURL = await getDownloadURL(uploadTask.ref);
				this.profilePhoto = downloadURL;

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
		async confirmEdits() {
			try {
				await updateDoc(doc(db, "Users", this.$root.user.uid), {
					telegramHandle: this.telegramHandle,
					cardholderName: this.cardholderName,
					cardNumber: this.cardNumber,
					CVV: this.CVV,
					expiryDate: this.expiryDate,
				});
				alert("Your details have been updated successfully.");

				this.initialTelegramHandle = this.telegramHandle;
				this.initialCardholderName = this.cardholderName;
				this.initialCardNumber = this.cardNumber;
				this.initialCVV = this.CVV;
				this.initialExpiryDate = this.expiryDate;
			} catch (error) {
				console.error("Error updating user details:", error);
				alert("There was an error updating your details.");
			}
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
	computed: {
		telegramHandleChanged() {
			return this.telegramHandle !== this.initialTelegramHandle;
		},
		cardholderNameChanged() {
			return this.cardholderName !== this.initialCardholderName;
		},
		cardNumberChanged() {
			return this.cardNumber !== this.initialCardNumber;
		},
		CVVChanged() {
			return this.CVV !== this.initialCVV;
		},
		expiryDateChanged() {
			return this.expiryDate !== this.initialExpiryDate;
		},
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

.edit-photo-button,
.upload-button,
.edit-details-button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
}

.cancel-button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #fff;
	color: #051e55;
	cursor: pointer;
	margin-top: 10px;
}

.hidden {
	display: none;
}

input {
	color: grey;
}

.edited {
	color: black;
}
</style>
