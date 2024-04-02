<template>
  <div class="marketplace-container">
    <ListingsParent/>
  </div>
</template>

<script>
import ListingsParent from '@/components/marketplace_components/ListingsParent.vue';


export default {
  name: 'Marketplace',
  components: {
    ListingsParent
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
  },
  created() {
  }
}
</script>
