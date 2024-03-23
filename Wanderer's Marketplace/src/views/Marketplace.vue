<template>
  <div class="marketplace-container">
    <FilterSidebar />
    <ProductListing />
  </div>
</template>

<script>
// Import the components
import FilterSidebar from '../components/marketplace_components/FilterSidebar.vue'
import ProductListing from '../components/marketplace_components/ProductListing.vue';

export default {
  name: 'Marketplace',
  components: {
    FilterSidebar,
    ProductListing
  }
}
</script>

<style scoped>
.marketplace-container {
  display: flex;
  max-width: 1200px; /* Adjust based on your layout's needs */
  margin: 0 auto; /* Centers the marketplace in the middle of the page */
  padding: 20px; /* Spacing around the marketplace */
  gap: 20px; /* Spacing between filter and listings */
}

/* You may need additional styles here to match the screenshot. */

</style>
