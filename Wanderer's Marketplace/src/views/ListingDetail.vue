<template>
	<div class="product-details-container">
		<div class="left">
			<ProductImage />
		</div>
		<div class="right">
			<ProductDetails />
            <button class="action-button" @click="buttonConfig.action">
				{{ buttonConfig.label }}
			</button>
		</div>
	</div>
</template>

<script>
import ProductImage from "../components/listing_components/ProductImage.vue";
import ProductDetails from "../components/listing_components/ProductDetails.vue";

export default {
	name: "ListingDetail",
	components: { ProductImage, ProductDetails },
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
            listingState: 'completed'
		};
	},
    computed: {
		buttonConfig() {
			const stateConfigs = {
				completed: {
					label: 'Leave Rating',
					action: this.leaveRating,
				},
				available: {
					label: 'Extend Offer',
					action: this.extendOffer,
				},
				// Add other states and configurations as needed
			};
			return stateConfigs[this.listingState] || {};
		}
	},
	methods: {
		leaveRating() {
			// Logic to leave a rating
		},
		extendOffer() {
			// Logic to extend an offer
		},
		// You can define other actions for different states here
    },
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
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
}
</style>
