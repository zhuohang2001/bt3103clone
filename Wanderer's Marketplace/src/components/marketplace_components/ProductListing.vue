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
  import firebaseApp from '@/firebase.js';
  import { getFirestore } from 'firebase/firestore';
  import app from "@/firebase.js";
  const db = getFirestore(firebaseApp);
  import { collection, query, where, getDocs } from 'firebase/firestore';

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
        // const { search, category, country, maxPrice, minDeliveryFee, maxDeliveryFee, sort } = filters;
        console.log("filters")
        console.log(filters)
        let q = query(collection(db, 'Listings'), where('ListingStatus', '==', 'available'));
        if (filters) {
            if (filters.category) {
            q = query(q, where('Category', '==', filters.category));
            }
            if (filters.search) {
              q = query(q, where('ProductName', '>=', filters.search), where('ProductName', '<=', filters.search + '\uf8ff'));
            }
            if (filters.country) {
              q = query(q, where('Country', '==', filters.country));
            }
            if (filters.maxPrice !== null) {
              q = query(q, where('MaxProductPrice', '<=', filters.maxPrice));
            }
            if (filters.minDeliveryFee !== null && filters.maxDeliveryFee !== null) {
              q = query(q, where('DeliveryFee', '>=', filters.minDeliveryFee), where('DeliveryFee', '<=', filters.maxDeliveryFee));
            }
        }
        const querySnapshot = await getDocs(q);
        this.products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(this.products)
        console.log("showing products")
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    },
  },
  };
  </script>
  