<template>
	<div class="product-name-header">
		<h1>{{ productDetails.name }}</h1>
		<div class="listing-user-details">
			<a
				:href="`tg://resolve?domain=${listingUser.telegramHandle}`"
				target="_blank"
			>
				@{{ this.listingUser.username }} | Telegram @{{
					this.listingUser.telegramHandle
				}}
			</a>
		</div>
	</div>
	<div class="product-details-container">
		<div class="left">
			<ProductImage :imageSrc="productDetails.imageUrl" />
		</div>
		<div class="right">
			<ProductDetailsViewing :product-details="productDetails" />
			<div
				v-if="productDetails.listingStatus === 'Accepted'"
				class="accepted-offer-container"
			>
				<div class="accepted-offer-header">
					<div class="accepted-offer-label">Accepted Offer:</div>
					<div class="accepted-offer-detail-box">
						<div class="detail">
							Username: <span>{{ acceptedOfferDetails.username }}</span>
						</div>
					</div>
					<div class="accepted-offer-detail-box telegram-detail-box">
						<a
							:href="`tg://resolve?domain=${acceptedOfferDetails.telegram}`"
							class="detail"
							target="_blank"
							>Telegram: <span>{{ acceptedOfferDetails.telegram }}</span></a
						>
					</div>
					<div class="accepted-offer-detail-box">
						<div class="detail">
							Offer Price: <span>${{ acceptedOfferDetails.offerPrice }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="buttons-container">
				<button
					v-if="
						productDetails.listingStatus === 'Available' &&
						!hasPendingOffer &&
						this.productDetails.userID != user.uid
					"
					class="action-button"
					@click="extendOffer"
				>
					Extend Offer
				</button>
				<button
					v-if="hasPendingOffer && productDetails.listingStatus === 'Available'"
					class="action-button pending-offer"
					disabled
				>
					Pending Offer
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Accepted' &&
						this.productDetails.userID != user.uid
					"
					class="action-button"
					@click="confirmPurchase"
				>
					Confirm Purchase
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Purchased' &&
						this.productDetails.userID == user.uid
					"
					class="action-button"
					@click="confirmDelivery"
				>
					Confirm Delivery
				</button>
				<button
					v-if="productDetails.listingStatus === 'Completed'"
					class="action-button"
					@click="leaveRating"
				>
					Leave Rating
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Available' &&
						this.productDetails.userID == user.uid
					"
					class="action-button"
					@click="viewOffers"
				>
					View Offers
				</button>
				<button
					v-if="
						productDetails.listingStatus === 'Available' &&
						this.productDetails.userID == user.uid
					"
					class="action-button"
					@click="deleteListing"
				>
					Delete Listing
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ProductDetailsViewing from "../components/listing_components/ProductDetailsViewing.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { mapState } from "vuex";

export default {
	name: "ListingDetail",
	components: { ProductImage, ProductDetailsViewing },
	data() {
		return {
			// ...other data properties
			hasPendingOffer: false, // This will track whether a pending offer exists
			acceptedOffer: null,
			offerUser: null,
			listingUser: null,
			offer: null,
		};
	},
	watch: {
		currentListing(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.checkForExistingOffer();
			}
		},
		"productDetails.listingStatus": function (newVal) {
			if (newVal === "Accepted") {
				this.fetchAcceptedOffer();
			}
		},
		user(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.checkForExistingOffer();
			}
		},
	},
	created() {
		this.fetchUserDetails(this.productDetails.userID);
		this.checkForExistingOffer();
	},
	mounted() {
		this.fetchAcceptedOffer();
	},
	computed: {
		...mapState(["currentListing", "user"]),
		productDetails() {
			// Use the currentListing from Vuex as the product details
			// or return a default object structure if currentListing is null/undefined
			console.log("currlisting", this.currentListing);
			return (
				this.currentListing || {
					name: "Loading...",
					quantity: 0,
					color: "",
					size: "",
					currency: "",
					minPrice: 0,
					maxPrice: 0,
					deliveryDate: "",
					country: "",
					listingStatus: "Available",
					userID: "",
				}
			);
		},
		acceptedOfferDetails() {
			if (!this.acceptedOffer || !this.offerUser) {
				return {
					username: "Loading...",
					telegram: "Loading...",
					offerPrice: "Loading...",
				};
			}
			if (this.user.uid === this.productDetails.userID) {
				console.log("abccc", this.offerUser.username);
				return {
					username: this.offerUser.username,
					telegram: this.offerUser.telegramHandle,
					offerPrice: this.acceptedOffer.OfferPrice,
				};
			} else {
				console.log("nnvvs", this.listingUser.username);
				return {
					username: this.listingUser.username,
					telegram: this.listingUser.telegramHandle,
					offerPrice: this.acceptedOffer.OfferPrice,
				};
			}
		},
		isCurrentUserTheLister() {
			console.log("Current user:", this.user.uid);
			console.log("Listing user:", this.productDetails.userID);
			return (
				this.user &&
				this.productDetails &&
				this.user.uid === this.productDetails.userID
			);
		},
		isTraveller() {
			return this.user.uid === this.productDetails.UserID;
		},

		buttonConfig() {
			// If there is a pending offer, return the configuration for the non-clickable button
			if (this.hasPendingOffer) {
				return {
					label: "Pending Offer",
					action: () => {}, // An empty function so the button does nothing when clicked
				};
			}
			const stateConfigs = {
				Completed: {
					label: "Leave Rating",
					action: this.leaveRating,
				},
				Available: {
					label: "Extend Offer",
					action: this.extendOffer,
				},
				Accepted: {
					label: "Confirm Purchase",
					action: this.confirmPurchase,
				},
				Purchased: {
					label: "Confirm Delivery",
					action: this.confirmDelivery,
				},
				// Add other states and configurations as needed
			};
			return stateConfigs[this.currentListing?.listingStatus] || {};
		},
	},
	methods: {
		leaveRating() {
			this.$router
				.push({
					name: "LeaveRating",
					params: {
						listingUser: this.currentListing.userID,
						offerUser: this.currentListing.acceptedOfferUserID,
					},
				})
				.catch((error) => {
					console.error("Router navigation error:", error);
				});
		},
		extendOffer() {
			this.$router.push({ name: "ListingDetailAction" });
		},
		viewOffers() {
			this.$router.push({ name: "ListingOfferAction" });
		},
		confirmPurchase() {
			this.$router.push({ name: "ListingConfirmPurchaseAction" });
		},
		confirmDelivery() {
			this.$router.push({ name: "ListingConfirmDeliveryAction" });
		},
		deleteImage() {
			const storage = getStorage(firebaseApp);

			const imageRef = storageRef(storage, this.productDetails.imageUrl);
			deleteObject(imageRef).then(() => {
				console.log("Image successfully deleted");
			});
			alert("Listing successfully deleted!");
			this.$router.push({ name: "Home" }); // Navigate to Home after deletion
		},

		deleteListing() {
			const db = getFirestore(firebaseApp);
			const listingId = this.productDetails.id; // Make sure this is the correct ID

			if (!listingId) {
				alert("No valid listing ID found!");
				return;
			}

			const docRef = doc(db, "Listings", listingId);
			deleteDoc(docRef)
				.then(() => {
					console.log("Listing successfully deleted");
				})
				.catch((error) => {
					console.error("Failed to delete the listing:", error);
				});

			this.deleteImage();
		},

		async fetchAcceptedOffer() {
			console.log("productdetailsnifonv:", this.productDetails);
			if (this.productDetails.listingStatus === "Accepted") {
				try {
					const offersRef = collection(db, "Offers");
					const q = query(
						offersRef,
						where("ListingID", "==", this.productDetails.id)
					);
					console.log("products user id", this.productDetails.userID);

					const querySnapshot = await getDocs(q);
					if (!querySnapshot.empty) {
						this.acceptedOffer = querySnapshot.docs[0].data();
						console.log("acceptedOffer133", this.acceptedOffer);
						const offerUserID = this.acceptedOffer.OfferByUserID;
						await this.fetchOfferUser(offerUserID);
						await this.fetchUserDetails(this.productDetails.userID);
					} else {
						console.error("No accepted offers found for this listing.");
						this.acceptedOffer = null;
					}
				} catch (error) {
					console.error("Error fetching accepted offer:", error);
					this.acceptedOffer = null;
				}
			}
		},
		async fetchOfferUser(userID) {
			try {
				const userRef = doc(db, "Users", userID);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists()) {
					this.offerUser = userSnap.data();
					console.log("thisistheofferuser:", this.offerUser);
				} else {
					console.error("No user found for ID:", userID);
					this.offerUser = null;
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				this.offerUser = null;
			}
		},

		async fetchUserDetails(userID) {
			try {
				const userRef = doc(db, "Users", userID);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists()) {
					this.listingUser = userSnap.data();
					console.log("thisisthelistinguser:", this.listingUser);
				} else {
					console.error("No user found for ID:", userID);
					this.listingUser = null;
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				this.listingUser = null;
			}
		},
		// You can define other actions for different states here
		async checkForExistingOffer() {
			try {
				const listingID = this.currentListing?.id; // replace with actual id property if different
				const userID = this.user?.uid; // replace with actual current user id property
				let q = query(
					collection(db, "Offers"),
					where("ListingID", "==", listingID)
				);
				q = query(q, where("OfferByUserID", "==", userID));
				// .where('OfferStatus', '==', 'Pending') //add check that offer is not of rejected

				const querySnapshot = await getDocs(q);
				this.hasPendingOffer = !querySnapshot.empty;
				// this.offer = querySnapshot.docs.map(doc => {
				// const data = doc.data();
				// return {
				// 	OfferID: data.OfferID,
				// 	ListingID: data.ListingID,
				// 	OfferByUserID: data.OfferByUserID,
				// 	OfferPrice: data.OfferPrice,
				// 	OfferStatus: data.OfferStatus
				// };
				// })
				console.log(this.offer);
				console.log("showing offer");
			} catch (error) {
				console.error("Error getting documents: ", error);
			}
		},
	},
};
</script>

<style scoped>
.action-button.pending-offer {
	background-color: #a9a9a9; /* Replace with the exact color from the screenshot */
	color: #000; /* Adjust if your button text color is different */
	border: 1px solid #a9a9a9; /* Use the same color for a solid button look or different for border */
}

.action-button.pending-offer:hover {
	background-color: #a9a9a9; /* Darker color for hover effect, adjust as needed */
	border-color: #a9a9a9; /* Border color change on hover, adjust as needed */
}

.product-details-container {
	display: flex;
	justify-content: center;
	align-items: stretch;
	padding: 20px;
}

.product-name-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	margin-top: 20px;
	padding: 20px 50px 0px 50px;
}

.product-name-header h1 {
	margin: 0;
}

.product-name-header a {
	color: inherit;
}

.left,
.right {
	flex: 1;
	padding: 10px;
}

.accepted-offer-container {
	background-color: #ffa500;
	padding: 15px;
	border-radius: 10px;
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.accepted-offer-header {
	background-color: #ffa500;
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 10px;
}
.accepted-offer-detail-box {
	background-color: white;
	border-radius: 10px;
	padding: 10px;
	display: flex;
	align-items: center;
	margin-left: 10px;
	flex-shrink: 0;
	height: 15px;
}

.accepted-offer-label {
	font-size: 16px;
	font-weight: bold;
}

.accepted-offer-details {
	background-color: white;
	border-radius: 10px;
	display: flex;
	justify-content: space-between;
	padding: 10px;
	margin-top: 10px; /* Space from label to details */
}

.detail {
	color: #333;
	font-weight: bold;
	margin: 0 5px;
	font-size: 15px;
}
.detail > span {
	font-weight: normal;
}

.action-button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
	margin-left: 10px;
}

.telegram-detail-box {
	transition: background-color 0.3s ease;
}

.telegram-detail-box:hover {
	background-color: #e6e6e6;
}
</style>
