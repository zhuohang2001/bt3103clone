<template>
    <div class="product-listing">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </template>
  
  <script>
  import ProductCard from './ProductCard.vue';
  
  export default {
    props: {
    filters: {
      type: Object,
      default: () => ({})
    }
  },
    components: {
      ProductCard,
    },
    data() {
      return {
        products: [],
      };
    },
    created() {
      this.fetchProducts();
    },
    watch: {
    filters: {
      handler(newFilters) {
        this.fetchProducts(newFilters);
      },
      deep: true
    }
  },
    methods: {
    async fetchProducts(filters) {
      try {
        let query = db.collection('listings');

        // Apply category filter
      if (filters.category) {
        query = query.where('Category', '==', filters.category);
      }

      // Apply search filter for product name
      if (filters.search) {
        query = query.where('ProductName', '>=', filters.search)
                     .where('ProductName', '<=', filters.search + '\uf8ff');
      }

      // Apply country filter
      if (filters.country) {
        query = query.where('Country', '==', filters.country);
      }

      // Apply max product price filter
      if (filters.maxPrice !== null) {
        query = query.where('MaxProductPrice', '<=', filters.maxPrice);
      }

      // Apply delivery fee range filter
      if (filters.minDeliveryFee !== null && filters.maxDeliveryFee !== null) {
        query = query.where('DeliveryFee', '>=', filters.minDeliveryFee)
                     .where('DeliveryFee', '<=', filters.maxDeliveryFee);
      }

        const querySnapshot = await query.get();
        this.products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    },
  },
  };
  </script>
  