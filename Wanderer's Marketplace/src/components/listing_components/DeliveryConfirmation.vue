<template>
    <div class="confirmation-card">
      <div class="confirmation-header"><b>Confirmation of Delivery</b></div>
      <div class="confirmation-body">
        <div class="proof-purchase">
            <div class="proof-text"><b>Proof of Purchase</b></div>
          <div class="document-container">
            <!-- Icon or image goes here -->
            <img src = "/icons/favicon_io/document icon.png" alt = "Document Icon" class = "document-icon">
          </div>
        </div>
        <div class="confirmation-text">
          I confirm that I have received <br> authentic products as requested.
        </div>
        <button class="confirm-btn" @click="confirmDelivery">Confirm</button>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'DeliveryConfirmation',
    props: {
        listingID: String
    },
    methods: {
      confirmDelivery() {
        // Emit an event or call a method to handle the confirmation logic
        this.$emit('delivery-confirmed', this.listingID);
        
      }
    }
  };
  </script>
  
  <style scoped>
  .confirmation-card {
    background-color: #ffffff;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  }
  .proof-purchase{
    background-color: #fff1e7;
    padding: 1rem;
    border-radius: 10px;
    height: auto;
  }
  .confirm-btn{
    padding: 10px 20px;
	border: none;
	border-radius: 30px;
	background-color: #051e55;
	color: #fff;
	cursor: pointer;
	margin-top: 10px;
  }
  .confirmation-header {
    margin-bottom: 10%;
  }
  .confirmation-text {
    margin-top: 10%;
  }
  </style>