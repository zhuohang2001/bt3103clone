<template>
    <div class="product-card">
      <img :src="product.imageUrl" alt="Product image">
      <h2>{{ product.name }}</h2>
      <p>{{ product.price }}</p>
      <!-- Other product details -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      product: Object,
    },
  };
  </script>
  
  <style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  object-fit: cover; /* This makes sure that the image covers the area without stretching. */
  aspect-ratio: 1 / 1; /* Adjust the aspect ratio as needed */
}

.product-info {
  padding: 16px;
  text-align: center;
}

.product-name {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

.product-price {
  font-size: 1.2rem;
  color: #666;
  font-weight: bold;
}
</style>