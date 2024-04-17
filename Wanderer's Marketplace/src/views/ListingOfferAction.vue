<template>
	<div class="product-details-container">
		<div class="left">
			<ProductImage />
		</div>
		<div class="right">
			<component :is="currentRightComponent" />
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ViewListingOffer from "../components/listing_components/ViewListingOffer.vue";
// Import other components as needed

export default {
	name: "ListingOfferAction",
	components: {
		ProductImage,
		ViewListingOffer,
		// Include other components you may need
	},
	data() {
		return {
			currentRightComponent: 'ViewListingOffer', // This can be changed based on the state
		};
	},
	// You can include methods, computed properties, or watchers to change the currentRightComponent based on the state
};
</script>

<style scoped>
.product-details-container {
	display: flex;
	justify-content: center;
	align-items: stretch;
	height: calc(100vh - 80px);
	padding: 50px;
	gap: 25px;
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

.action-button {
	padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #4CAF50; /* A green color to match the Submit button in the image */
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
}
</style>
