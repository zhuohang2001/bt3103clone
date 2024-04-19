<template>
    <div>
      <h1>Payment Successful!</h1>
      <!-- Show more information about the order or offer -->
    </div>
  </template>
  
  <script>
  import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
  
  export default {
    name: 'PaymentSuccess',
    props: ['offerId'],
    created() {
      const offerId = this.$route.query.offerId;
      this.updateListingStatus(offerId);
    },
    methods: {
      async updateListingStatus(offerId) {
        const db = getFirestore();
        // const offerId = this.$route.query.offerId; // Retrieve the offerId from the URL query parameter


        const offerDocRef = doc(db, "Offers", offerId);

		await getDoc(offerDocRef).then((offerDoc) => {
		if (!offerDoc.exists()) {
			console.error("No such offer found!");
			return;
		}
        updateDoc(offerDocRef, {
            OfferStatus: "Accepted"
        });
        console.log(`Offer ${offerId} updated to Accepted.`);

		// Extract listing ID from the offer document
		const listingId = offerDoc.data().ListingID;
		const listingDocRef = doc(db, "Listings", listingId);

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
  