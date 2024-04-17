<template>
  <div class="product-name-header">
		<h1>{{ productDetails.name }}</h1>
	</div>
	<div class="payment-container">
		<div class="left">
			<!-- Assuming you have a ProductImage component as in the ViewListingOffer.vue -->
			<ProductImage :imageSrc="productDetails.imageUrl" />
		</div>
		<div class="right">
			<div class="price-container">
				<h2>${{ offerPrice }}</h2>
				<button class="pay-button" @click="processPayment">Pay</button>
			</div>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ProductDetailsViewing from "../components/listing_components/ProductDetailsViewing.vue";
import firebaseApp from '@/firebase.js';
import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { mapState } from 'vuex';

export default {
  name: "Payment",
  components: { ProductImage, ProductDetailsViewing },
  props: {
  },
  data() {
    return {
      productDetails: {},
      offerPrice: null
    };
  },
  created() {
    this.fetchOfferDetails();
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
		}
  },
  methods: {
    async fetchOfferDetails() {
      const offerId = this.$route.params.offerId; // Retrieve the offerId from the route parameters
      if (!offerId) {
        console.error("Offer ID is undefined");
        return;
      }
      
      // Use the offerId to fetch offer details
      const db = getFirestore(firebaseApp);
      const offerDocRef = doc(db, "Offers", offerId);

      try {
        const offerDoc = await getDoc(offerDocRef);
        if (offerDoc.exists()) {
          const offerData = offerDoc.data();
          this.offerPrice = offerData.OfferPrice;
          this.fetchProductDetails(offerData.ListingID);
        } else {
          console.error("No such offer found!");
        }
      } catch (error) {
        console.error("Error fetching offer details:", error);
      }
    },
	async fetchProductDetails(listingId) {
		const db = getFirestore(firebaseApp);
		const listingDocRef = doc(db, "Listings", listingId);

		try {
			const listingDoc = await getDoc(listingDocRef);
			if (listingDoc.exists()) {
				this.productDetails = listingDoc.data();
			} else {
				console.error("No such listing found!");
			}
		} catch (error) {
			console.error("Error fetching listing details:", error);
		}
	},
	processPayment() {
    // Here you would have your logic to process the payment
    const offerId = this.$route.params.offerId;
    console.log("Processing payment for offer", this.offerId);
    if (!offerId) {
      console.error("Offer ID is undefined");
      return;
    }

    // Fetch the offer document to get the associated listing ID
    const offerDocRef = doc(getFirestore(firebaseApp), "Offers", offerId);
    getDoc(offerDocRef).then((offerDoc) => {
      if (!offerDoc.exists()) {
        console.error("No such offer found!");
        return;
      }

      // Extract listing ID from the offer document
      const listingId = offerDoc.data().ListingID;
      const listingDocRef = doc(getFirestore(firebaseApp), "Listings", listingId);

      // Update the listing's status to "Accepted"
      updateDoc(listingDocRef, {
        ListingStatus: "Accepted"
      }).then(() => {
        console.log(`Offer ${offerId} accepted and listing ${listingId} updated to Accepted.`);
        alert(`Payment successful and offer accepted!`);
        // Here you would probably also want to navigate to a success page or update the state
      }).catch((error) => {
        console.error("Error updating listing status:", error);
        alert("There was an issue with processing the payment.");
      });

    }).catch((error) => {
      console.error("Error fetching offer details:", error);
    });
    this.$router.push('/home');
  }
}
};
</script>

<style scoped>
.payment-container {
	display: flex;
	justify-content: center;
	align-items: stretch;
	height: calc(100vh - 80px);
	padding-left: 50px;
	padding-top: 10px;
	gap: 85px;
}

.left {
	flex: 1;
	/* Your styles for left container */
}

.right {
	display: flex;
	align-items: center;
	background-color: #f0e6d2;
	padding: 20px;
  width: 100%;
	height: 40%;
	border-radius: 10px;
	overflow: hidden;
}

.price-container {
	background-color: #1c1e86; /* Blue background color */
	color: white; /* White text color */
	font-size: 45px; /* Larger font size */
	padding: 40px; /* Add padding for spacing */
	border-radius: 20px; /* Add border radius for rounded corners */
	width: 40%; /* Take up almost the size of the whole right container */
  height: 80%;
}

.pay-button {
	margin-top: 10px; /* Add margin to separate button from the price */
	background-color: #4CAF50; /* Green background color for button */
	color: white; /* White text color */
	border: none; /* Remove button border */
	padding: 10px 20px; /* Add padding for button size */
	border-radius: 5px; /* Add border radius for rounded button */
	cursor: pointer; /* Add pointer cursor on hover */
  width: 60%;
}
</style>