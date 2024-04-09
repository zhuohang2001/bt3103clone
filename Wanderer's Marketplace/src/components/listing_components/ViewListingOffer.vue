<template>
    <div class="view-offers-outer-container" v-if="listing">
      <div class="view-offers-inner-container" >
        <h2 class="view-offers-heading">View Offers</h2>
  
        <!-- Listing Section -->
        <div class="listing-section">
          <img :src="listing.imageUrl" alt="Listing Image" class="listing-image" />
          <div class="listing-details">
            <p class="listing-title">{{ listing.title }}</p>
            <p class="listing-status">{{ listing.status }}</p>
          </div>
        </div>
  
        <!-- Offers Section -->
        <div class="offers-container">
          <div 
            v-for="offer in offers" 
            :key="offer.id"
            class="offer-card"
            @click="selectOffer(offer)"
          >
            <img :src="getUserImageUrl(offer.OfferByUserID)" alt="User Image" class="user-image" />
            <div class="offer-info">
              <p class="user-name">{{ offer.OfferByUserID }}</p>
              <p class="offer-price">Offered: ${{ offer.OfferPrice }}</p>
            </div>
          </div>
        </div>
  
        <!-- Selected Offer Details -->
        <div v-if="selectedOffer" class="selected-offer-details">
          <h3>{{ selectedOffer.OfferByUserID }} has offered</h3>
          <div class="offer-amount">$ {{ selectedOffer.OfferPrice }}</div>
          <div class="offer-actions">
            <button class="action-button accept-button" @click="acceptOffer(selectedOffer)">Accept</button>
            <button class="action-button reject-button" @click="rejectOffer(selectedOffer)">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
    import { mapState } from 'vuex';
    import firebaseApp from '../../firebase.js';
    import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

    export default {
    name: "ViewListingOffers",
    computed: {
        ...mapState(['currentListing']),
        listingId() {
        // Ensure that the ID is correctly retrieved from your Vuex state
        return this.currentListing?.id;
        },
    },
    data() {
        return {
        listing: {},
        offers: [],
        selectedOffer: null,
        users: {}, // Initialize as an object
        };
    },
    created() {
        // Use the computed property here
        this.fetchData();
    },
    methods: {
        async fetchData() {
        if (this.listingId) {
            await this.fetchListing();
            await this.fetchOffers();
            await this.fetchUsers();
        } else {
            console.error("No listing ID provided");
        }
        },
        async fetchListing() {
        try {
        const docRef = doc(getFirestore(firebaseApp), "Listings", this.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data()) {
            this.listing = {
            ...docSnap.data(),
            id: docRef.id // Add the document ID to the listing object
            };
        } else {
            console.error("No such listing!");
        }
        } catch (error) {
        console.error("Error fetching listing:", error);
        }
    },
    async fetchOffers() {
        if (!this.listingId) {
        console.error("Listing ID is undefined");
        return;
        }
        try {
        const offersCollectionRef = collection(getFirestore(firebaseApp), "Offers");
        const q = query(offersCollectionRef, where("ListingID", "==", this.listingId));
        const querySnapshot = await getDocs(q);
        this.offers = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id // Add the document ID to each offer
        }));
        } catch (error) {
        console.error("Error fetching offers:", error);
        }
    },
        async fetchUsers() {
        try {
            const usersCollectionRef = collection(getFirestore(firebaseApp), "Users");
            const querySnapshot = await getDocs(usersCollectionRef);
            querySnapshot.forEach((doc) => {
            // Use object notation to maintain reactivity
            this.$set(this.users, doc.id, doc.data());
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        },
        getUserName(userId) {
        // Revised to use object notation
        return this.users[userId]?.username || 'Unknown';
        },
        getUserImageUrl(userId) {
        // Revised to use object notation
        return this.users[userId]?.profileImageUrl || 'default-profile.jpg';
        },
        // acceptOffer and rejectOffer methods remain the same
    },
};
</script>
  
  
  <style scoped>
  .view-offers-outer-container {
    background: #f0e6d2;
    padding: 1em;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  
  .view-offers-inner-container {
    background: white;
    border-radius: 16px;
    padding: 2em;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    width: 100%;
  }
  
  .view-offers-heading,
  .listing-title,
  .listing-status,
  .offer-price,
  .user-name {
    text-align: center;
  }
  
  .listing-section,
  .offers-container,
  .selected-offer-details {
    margin-bottom: 1em;
  }
  
  .listing-image {
    max-width: 100%;
    border-radius: 4px;
  }
  
  .user-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  .offer-card {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 0.5em;
  }
  
  .offer-info {
    margin-left: 1em;
  }
  
  .action-button {
    padding: 0.5em;
    margin-top: 0.5em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  
  .accept-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .reject-button {
    background-color: #f44336;
    color: white;
  }
  </style>
  