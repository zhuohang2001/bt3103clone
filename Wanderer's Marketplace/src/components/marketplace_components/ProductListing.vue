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
        let q = query(collection(db, 'Listings'), where('ListingStatus', '==', 'Available'));
        // console.log(this.$store.state.user)
        //   if (this.$store.state.user) {
        //     console.log('hi')
        //     console.log(this.$store.state.user.uid)
        //     const user_uid = this.$store.state.user.uid
        //     q = query(q, where('UserID', '!=', user_uid));
        //   }
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
        this.products = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.ProductName, // Make sure 'ProductName' matches the field in Firestore
            price: data.MaxProductPrice, // Same here for 'MaxProductPrice'
            date: data.DateCreation, // And for 'DateCreation'
            country: data.Country, // And for 'Country'
            imageUrl: data.ProductImage // Ensure there is an image URL in the data
            // Add other product details you want to display...
          };
        })
        console.log(this.products)
        console.log("showing products")
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    },
  },
  };
  </script>
  
  <style scoped>

  .product-listing {
    display: grid;
    grid-template-columns: repeat(3,minmax(200px, 1fr)); /* This will create three columns of equal width */
    grid-gap: 26px; /* This will create space between your cards */
    padding: 26px;
    /* Add responsive behavior if necessary */
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr); /* Two columns for smaller screens */
    }
    @media (max-width: 768px) {
      grid-template-columns: 1fr; /* One column for even smaller screens */
    }
  }

  </style>