<template>
	<div class="product-details">
		<form id="myform">
			<div class="title">Product Details</div>
			<div class="header">Product Name</div>
			<div class="input-row">
				<input
					type="text"
					v-model="productName"
					id="productName"
					placeholder="Product Name"
					required=""
				/>
			</div>
			<div class="header">Purchase Quantity, Colour and Size</div>
			<div class="input-row">
				<input
					type="number"
					v-model.number="quantity"
					id="quantity"
					placeholder="Quantity"
					required=""
				/>
				<input type="text" v-model="colour" placeholder="Colour" id="colour"/>
				<input type="text" v-model="size" placeholder="Size" id="size"/>
			</div>
			<div class="header">Purchase Currency, Minimum Product Price and Maximum Product Price</div>
			<div class="input-row">
				<input type="text" v-model="currency" placeholder="Currency" id="currency"/>
				<input
					type="number"
					step="0.01"
					v-model.number="minProductPrice"
					id="minProductPrice"
					placeholder="Min. Product Price"
					required=""
				/>
				<input
					type="number"
					step="0.01"
					v-model.number="maxProductPrice"
					id="maxProductPrice"
					placeholder="Max. Product Price"
					required=""
				/>
			</div>
			<div class="header">Delivery Fee and Country of Purchase</div>
			<div class="input-row">
				<input
					type="number"
					step="0.01"
					v-model="deliveryFee"
					id="deliveryFee"
					placeholder="Delivery Fee"
					required=""
				/>
				<input type="text" v-model="country" placeholder="Country" required="" id="country" />
			</div>
			<div class="header">Preferred Estimated Delivery Date</div>
			<div class="input-row">
				<input
					type="date"
					v-model="estimatedDeliveryDate"
					id="estimatedDeliveryDate"
					placeholder="Estimated Delivery Date"
					required=""
				/>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			productName: "",
			quantity: null,
			colour: "",
			size: "",
			currency: "",
			minPrice: null,
			maxPrice: null,
			deliveryDate: "",
			country: "",
		};
	},
};
</script>

<style scoped>
.product-details {
	background-color: #fff1e7;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.title {
	font-size: 1.2rem;
	font-weight: bold;
	margin-bottom: 1rem;
	text-align: left;
}

.header {
	font-size: 0.8rem;
	text-align: left;
}

.input-row {
	display: flex;
	gap: 1rem;
	margin-bottom: 1rem;
}

.input-row input {
	flex: 1;
	padding: 0.5rem;
	border-radius: 5px;
	border: 1px solid #ccc;
}
</style>
