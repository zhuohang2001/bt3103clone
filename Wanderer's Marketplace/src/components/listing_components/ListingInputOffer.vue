<template>
    <div class="input-offer-outer-container">
      <div class="input-offer-inner-container">
        <h2 class="offer-heading">Input your offer</h2>
        <p class="offer-description">
          This offer includes the product price and delivery fee.
        </p>
        <div class="offer-input-wrapper">
          <input type="number" v-model.number="offer" class="offer-input" placeholder="$0" min="0" />
          <button @click="submitOffer" class="submit-offer-button">Submit</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "InputListingOffer",
    data() {
      return {
        offer: 130, // Default value to match the image
      };
    },
    methods: {
      submitOffer() {
        // Submit the offer
        console.log('Offer submitted:', this.offer);
        // Here you would handle the offer submission (e.g., API call)
        this.$emit('offerSubmitted', this.offer);
      },
    },
  };
  </script>
  
  <style scoped>
  .input-offer-outer-container {
    background: #f0e6d2; /* Beige background */
    padding: 1em;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; /* Make the outer container fill the height */
    width: 100%; 
    margin-left: auto;
  }
  
  .input-offer-inner-container {
    background: white; /* White inner box */
    border-radius: 16px;
    padding: 2em;
    max-width: 400px; /* Limit the width to match your design */
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* Optional: add some shadow */
    width: 100%; /* Make the inner container take full width */
  }
  
  .offer-heading,
  .offer-description {
    text-align: center;
  }
  
  .offer-input-wrapper {
    margin-top: 1em;
  }
  
  .offer-input {
    font-size: 2em;
    padding: 0.5em;
    margin-bottom: 1em;
    border: 2px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }
  
  .submit-offer-button {
    width: 100%;
    padding: 0.5em;
    border: none;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    font-size: 1em;
  }
  </style>
  