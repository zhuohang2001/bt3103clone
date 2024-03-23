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
  