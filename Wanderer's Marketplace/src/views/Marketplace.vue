<template>
  <div class="marketplace-container">
    <FilterSidebar :filters="filters" @apply-filters="fetchProducts" />
    <ProductListing :products="products" />
  </div>
</template>

<script>
import FilterSidebar from '../components/marketplace_components/FilterSidebar.vue'
import ProductListing from '../components/marketplace_components/ProductListing.vue';

export default {
  name: 'Marketplace',
  components: {
    FilterSidebar,
    ProductListing
  },
  data() {
    return {
      filters: {
        search: '',
        category: '',
        sort: '',
        country: '',
        maxPrice: null,
        minDeliveryFee: null,
        maxDeliveryFee: null
      },
      products: []
    };
  },
  methods: {
    fetchProducts() {
      // Logic to fetch products based on the filters
      // This will involve making a request to your backend service with the filter parameters
      // Then, update the `products` array with the response data
    }
  },
  created() {
    this.fetchProducts(); // Fetch initial product listings without any filters
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
