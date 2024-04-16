<template>
  <div class = "listing-image-details">
    <div class = "listing-name">{{ currentListing.name }}</div>
    <div class="image-container">
			<img :src="currentListing.imageUrl" alt="Product Image" />
		</div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "ListingImageDetails",
  computed: {
    ...mapState(['currentListing']),
        listingId() {
        // Ensure that the ID is correctly retrieved from your Vuex state
        return this.currentListing?.id;
        },
    },
	props: {
		imageSrc: {
			type: String,
			required: true,
		},
	},
};
</script>

<style scoped>
.listing-image-details {
	background-color: #fff1e7;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.listing-name {
	font-size: 1.2rem;
	font-weight: bold;
	margin-bottom: 1rem;
  text-align: left;
  margin-left: 10%;
}

.image-container {
	width: 100%;
	height: auto;
	border-radius: 10px;
	overflow: hidden;
}

.image-container img {
	width: 60%;
	height: auto;
	border-radius: 10px;
}
</style>