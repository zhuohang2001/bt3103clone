<script>
import ProductDetails from '@/components/listing_components/ProductDetails.vue';
import ProductImage from '@/components/listing_components/ProductImage.vue';

export default {
  name: 'AddNewListing',
  components: {
    ProductDetails,
    ProductImage
  }
}
</script>

<template>
	<div>
        <h1>Add Listing</h1>
    </div>
    <div class="product-details-container">
        <div class="left">
			<ProductImage />
		</div>
		<div class="right">
			<ProductDetails />
			<button class="add-listing-button">
				Add Listing
			</button>
		</div>
	</div>
</template>

<style>
    h1 {
        margin-top: 20px;
        text-align: left;
        margin-left: 40px;
    }

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

    .add-listing-button {
        padding: 10px 20px;
        border: none;
        border-radius: 30px;
        background-color: #051e55;
        color: #fff;
        cursor: pointer;
        margin-top: 10px;
    }
</style>