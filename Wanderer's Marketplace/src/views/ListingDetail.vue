<template>
	<div class="product-name-header">
		<h1>{{ productDetails.name }}</h1>
	</div>
	<div class="product-details-container">
		<div class="left">
			<ProductImage :imageSrc="productDetails.imageUrl" />
		</div>
		<div class="right">
			<ProductDetailsViewing :product-details="productDetails" />
			<div class="buttons-container">
				<button v-if="productDetails.listingStatus === 'Available'" class="action-button" @click="editListing">
					Edit Listing
				</button>
				<button class="action-button" @click="buttonConfig.action" :disabled="hasPendingOffer">
					{{ buttonConfig.label }}
				</button>
				<button v-if="productDetails.listingStatus === 'Available'" class="action-button" @click="viewOffers">
					View Offers
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ProductDetailsViewing from "../components/listing_components/ProductDetailsViewing.vue";
import firebaseApp from '@/firebase.js';
import { getFirestore } from 'firebase/firestore';
import app from "@/firebase.js";
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs } from 'firebase/firestore';
import { mapState } from 'vuex';

export default {
	name: "ListingDetail",
	components: { ProductImage, ProductDetailsViewing },
	data() {
		return {
			// ...other data properties
			hasPendingOffer: false, // This will track whether a pending offer exists
		};
	},
	watch: {
		currentListing(newVal, oldVal) {
			if (newVal !== oldVal) {
			this.checkForExistingOffer();
			}
		},
		user(newVal, oldVal) {
			if (newVal !== oldVal) {
			this.checkForExistingOffer();
			}
		},
		},
		created() {
		this.checkForExistingOffer();
	},
	computed: {
		...mapState(['currentListing', 'user']),
		productDetails() {
		// Use the currentListing from Vuex as the product details
		// or return a default object structure if currentListing is null/undefined
		console.log("currlisting", this.currentListing)
		return this.currentListing || {
			name: "Loading...",
			quantity: 0,
			color: "",
			size: "",
			currency: "",
			minPrice: 0,
			maxPrice: 0,
			deliveryDate: "",
			country: "",
			listingStatus: "Available"
		};
		},

		buttonConfig() {
			// If there is a pending offer, return the configuration for the non-clickable button
			if (this.hasPendingOffer) {
			return {
				label: 'Pending Offer',
				action: () => {}, // An empty function so the button does nothing when clicked
			};
			}
			const stateConfigs = {
				Completed: {
					label: 'Leave Rating',
					action: this.leaveRating,
				},
				Available: {
					label: 'Extend Offer',
					action: this.extendOffer,
				},
				// Add other states and configurations as needed
			};
			return stateConfigs[this.currentListing?.listingStatus] || {};
		}
	},
	methods: {
		leaveRating() {
			// Logic to leave a rating
		},
		extendOffer() {
			this.$router.push({ name: 'ListingDetailAction' });
		},
		viewOffers() {
			this.$router.push({ name: 'ListingOfferAction' });
		},
		// You can define other actions for different states here
		async checkForExistingOffer() {
			try {
				const listingID = this.currentListing?.id; // replace with actual id property if different
				const userID = this.user?.uid; // replace with actual current user id property
				let q = query(collection(db, 'Offers'), where('ListingID', '==', listingID));
				q = query(q, where('OfferByUserID', '==', userID))

				// .where('OfferStatus', '==', 'Pending') //add check that offer is not of rejected

				const querySnapshot = await getDocs(q);
				this.hasPendingOffer = !querySnapshot.empty;
				// const querySnapshot = await getDocs(q);
				// this.offer = querySnapshot.docs.map(doc => {
				// const data = doc.data();
				// return {
				// 	OfferID: doc.OfferID,
				// 	ListingID: doc.ListingID,
				// 	OfferByUserID: doc.OfferByUserID,
				// 	OfferPrice: doc.OfferPrice,
				// 	OfferStatus: doc.OfferStatus
				// };
				// })
				console.log(this.offer)
				console.log("showing offer")
			} catch (error) {
				console.error("Error getting documents: ", error);
			}
		},
	},
};
</script>

<style scoped>
.product-details-container {
	display: flex;
	justify-content: center;
	align-items: stretch;
	height: calc(100vh - 80px);
	padding-left: 50px;
	padding-top: 10px;
	gap: 25px;
}

h1 {
	margin-top: 20px;
	text-align: left;
	margin-left: 40px;
}

.left {
	flex: 1;
}

.right {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.buttons-container {
	display: flex;
	justify-content: space-evenly; /* This will space out your buttons evenly */
	width: 100%; /* Ensure the container takes full width */
}

.action-button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
}
</style>
