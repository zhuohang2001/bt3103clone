<template>
	<div class="product-image">
		<div class="title">Product Image</div>
		<div class="image-container">
			<img src="/images/logo_without_words.png" alt="Product Image" />
		</div>
	</div>
</template>

<script>
export default {
	name: "ProductImage",
	props: {
		imageSrc: {
			type: String,
			required: true,
		},
	},
};
</script>

<style scoped>
.product-image {
	background-color: #ffffff;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.title {
	font-size: 1.2rem;
	font-weight: bold;
	margin-bottom: 1rem;
}

.image-container {
	width: 80%;
	height: auto;
	border-radius: 10px;
	overflow: hidden;
}

.image-container img {
	width: 100%;
	height: auto;
	border-radius: 10px;
}
</style>
