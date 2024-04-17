<template>
    <div class="confirmation-card">
      <div class="confirmation-header"><b>Confirmation of Delivery</b></div>
      <div class="confirmation-body">
        <div class="proof-purchase">
            <div class="proof-text"><b>Proof of Purchase</b></div>
          <div class="document-container">
            <!-- Icon or image goes here -->
            <img src = "/icons/favicon_io/document icon.png" alt = "Document Icon" class = "document-icon">
          </div>
        </div>
        <div class="confirmation-text">
          I confirm that I have received <br> authentic products as requested.
        </div>
        <button class="confirm-btn" @click="confirmDelivery">Confirm</button>   
      </div>
    </div>
  </template>
<script>
// ... other imports
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export default {
  name: 'PurchaseConfirmation',
  computed: {
        ...mapState(['currentListing']),
        listingId() {
        // Ensure that the ID is correctly retrieved from your Vuex state
        return this.currentListing?.id;
        },
    },
  // ... other options
  data() {
    return {
      // ... other data properties
      offer: null, // Placeholder for the current offer object
    };
  },
  created() {
        this.getOffer()
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            console.log("Authentication state changed: ", user.email);
            if (user) {
            this.userUID = user.uid;
            console.log('User is logged in');
            this.fetchProducts(); // Fetch products once user is logged in
            } else {
            console.log("User is not logged in.")
            }
        });
    },
  methods: {
    // Method to retrieve the current offer from state
    async getOffer() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore(firebaseApp);
        const offersRef = collection(db, "Offers"); //check
        const q = query(
          offersRef,
          where("ListingID", "==", this.$store.state.currentListing.id), //check
          where("OfferByUserID", "==", user.uid)
        );

        try {
          const querySnapshot = await getDocs(q);
          const offers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          // Assuming that there will be only one offer matching the criteria
          this.offer = offers.length > 0 ? offers[0] : null;
          if (this.offer) {
            console.log("Offer found: ", this.offer);
          } else {
            console.error("No matching offer found");
          }
        } catch (error) {
          console.error("Error getting offers: ", error);
        }
      } else {
        console.error("User is not authenticated");
      }
    },
    // ... other methods
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && this.offer) {
        const storage = getStorage();
        const storageRef = ref(storage, `receipts/${this.offer.OfferID}/${file.name}`); //check
        uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            this.updateOfferWithImage(downloadURL);
          });
        }).catch((error) => {
          console.error("Upload failed", error);
        });
      }
    },
    // Method to update the offer with the image URL
    async updateOfferWithImage(imageUrl) {
      this.receiptImageUrl = imageUrl;
      const offerDocRef = doc(getFirestore(firebaseApp), "Offers", this.offer.OfferID);
      try {
        await updateDoc(offerDocRef, {
          purchaseProofImage: imageUrl
        });
        this.$emit('confirmedPurchase', this.listing);
        this.$router.push('/home');
        console.log('Offer updated with image URL');
      } catch (error) {
        console.error("Error updating offer with image:", error);
      }
    },
    // ... other methods
  },
};
</script>

  
  <style scoped>
  .confirmation-card {
    background-color: #ffffff;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  }
  .proof-purchase{
    background-color: #fff1e7;
    padding: 1rem;
    border-radius: 10px;
    height: auto;
  }
  .confirm-btn{
    padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
  }
  .confirmation-header {
    margin-bottom: 10%;
  }
  .confirmation-text {
    margin-top: 10%;
  }
  </style>