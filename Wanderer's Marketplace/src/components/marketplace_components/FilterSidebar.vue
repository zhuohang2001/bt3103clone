<template>
  <div class="filter-sidebar">
    <!-- Search input -->
    <div class="filter-item">
      <input type="text" v-model="search" placeholder="Search" class="search-input" />
      <button class="search-button">
        <!-- Add search icon here -->
      </button>
    </div>

    <!-- Category select -->
    <div class="filter-item">
      <select v-model="category">
        <option disabled value="">Category</option>
        <option>Electronics</option>
        <option>Beauty</option>
        <option>Consumables</option>
      </select>
    </div>

    <!-- Sort select -->
    <div class="filter-item">
      <select v-model="sort">
        <option disabled value="">Sort By</option>
        <option>Popularity</option>
        <option>Newest</option>
        <option>Oldest</option>
      </select>
    </div>

    <!-- Country select -->
    <div class="filter-item">
      <select v-model="country">
        <option disabled value="">Country of Purchase</option>
        <!-- Populate with actual country options -->
      </select>
    </div>

    <!-- Price range input -->
    <div class="filter-item">
      <input type="number" v-model.number="maxPrice" placeholder="Max. Price" />
    </div>

    <!-- Delivery fee range input -->
    <div class="filter-item">
      <input type="number" v-model.number="minDeliveryFee" placeholder="Min. Fee" />
      <input type="number" v-model.number="maxDeliveryFee" placeholder="Max. Fee" />
    </div>

    <!-- Action buttons -->
    <div class="filter-item action-buttons">
      <button @click="applyFilters">Apply Filters</button>
      <button @click="resetFilters">Reset to Default</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      category: '',
      sort: '',
      country: '',
      maxPrice: null,
      minDeliveryFee: null,
      maxDeliveryFee: null
    }
  },
  methods: {
    applyFilters() {
      // Logic to apply filters
    },
    resetFilters() {
      // Logic to reset all filters to their default state
      this.search = '';
      this.category = '';
      this.sort = '';
      this.country = '';
      this.maxPrice = null;
      this.minDeliveryFee = null;
      this.maxDeliveryFee = null;
    }
  }
}
</script>

<style scoped>
.filter-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #F8F8F8;
  padding: 1rem;
  border-radius: 10px;
}

.filter-item {
  margin-bottom: 0.5rem;
}

.search-input,
select,
input[type="number"] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
}

.action-buttons button {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  margin-top: 0.5rem;
}

/* You can add more styles to match the screenshot */
</style>
