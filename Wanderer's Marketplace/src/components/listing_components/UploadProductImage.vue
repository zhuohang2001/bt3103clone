<template>
	<div class="product-image">
		<div class="title">Upload Product Image</div>
		<div class="image-container">
			<img :src="imageSrc" alt="Product Image" />
			<br />
			<input type="file" @change="handleFileChange" accept="image/*" />
		</div>
	</div>
</template>

<script>
export default {
	name: "UploadProductImage",
	props: {
		imageSrc: {
			type: String,
			required: true, // Add a default value
		},
	},
	methods: {
		handleFileChange(event) {
			const file = event.target.files[0];
			if (file) {
				// You can perform additional validation here if needed
				const reader = new FileReader();
				reader.onload = () => {
					this.$emit("update:imageSrc", reader.result);
				};
				reader.readAsDataURL(file);
			}
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
	width: 100%;
	height: auto;
	border-radius: 10px;
	overflow: hidden;
}

.image-container img {
	width: 50%;
	height: auto;
	border-radius: 10px;
	justify-content: center;
}
</style>
