<template>
	<div>
		<ProductDetails />
		<button class="leave-rating-button" @click="leaveRating">
			Leave Rating
		</button>
	</div>
</template>

<script>
import ProductDetails from "../components/marketplace_components/ProductDetails.vue";

export default {
	name: "ListingCompleted",
	components: {
		ProductDetails,
	},
	data() {
		return {
			productDetails: {
				// Sample product details data (replace with actual data)
				name: "Sample Product",
				quantity: 10,
				color: "Blue",
				size: "Medium",
				currency: "USD",
				minPrice: 10.99,
				maxPrice: 29.99,
				deliveryDate: "2024-03-25",
				country: "USA",
			},
		};
	},
	methods: {
		leaveRating() {
			// Logic to navigate to the rating page or perform any other action
		},
	},
};
</script>

<style scoped>
.leave-rating-button {
	position: fixed;
	bottom: 20px;
	right: 20px;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
}
</style>
