<template>
    <div>
      <FilterSidebar @filters-applied="handleFiltersApplied" />
      <ProductListing :filters="activeFilters" />
    </div>
  </template>
  
  <script>
  import FilterSidebar from './FilterSidebar.vue';
  import ProductListing from './ProductListing.vue';
  
  export default {
    components: {
      FilterSidebar,
      ProductListing
    },
    data() {
      return {
        activeFilters: {}
      }
    },
    methods: {
      handleFiltersApplied(filters) {
        console.log("Filters applied:", filters);
        this.activeFilters = filters;
      }
    }
  }
  </script>
  