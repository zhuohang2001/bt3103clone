<template>
	<div>
        <h1>Add Listing</h1>
    </div>
    <div class="product-details-container">
        <div class="left">
			<ProductImage />
		</div>
		<div class="right">
			<ProductDetails />
			<button class="add-listing-button" type="button" v-on:click="createnewlisting">
				Add Listing
			</button>
		</div>
	</div>
</template>

<script>
import ProductDetails from '@/components/listing_components/ProductDetails.vue';
import ProductImage from '@/components/listing_components/ProductImage.vue';

import firebaseApp from '../firebase.js';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);

export default {
  name: 'AddNewListing',
  components: {
    ProductDetails,
    ProductImage
  },
  methods: {
    async createnewlisting() {
        let productName = document.getElementById("productName").value
        let quantity = document.getElementById("quantity").value
        let colour = document.getElementById("colour").value
        let size = document.getElementById("size").value
        let currency = document.getElementById("currency").value
        let minProductPrice = document.getElementById("minProductPrice").value
        let maxProductPrice = document.getElementById("maxProductPrice").value
        let deliveryFee = document.getElementById("deliveryFee").value
        let country = document.getElementById("country").value
        let estimatedDeliveryDate = document.getElementById("estimatedDeliveryDate").value

        alert("Created your listing for : " + productName)

        try{
            const docRef = await setDoc(doc(db, "Listings", productName), {
                ListingID: null,
                UserID: null,
                ProductImage: null,
                ProductName: productName,
                Quantity: quantity,
                Colour: colour,
                Size: size,
                Currency: currency,
                MinProductPrice: minProductPrice,
                MaxProductPrice: maxProductPrice,
                DeliveryFee: deliveryFee,
                Country: country,
                EstimatedDeliveryDate: estimatedDeliveryDate,
                ListingStatus: "available",
                DateCreation: null,
                TimeCreation: null,
            })
            console.log(docRef)
            document.getElementById('myform').reset();
            this.$emit("added")
            }
            catch(error) {
                console.error("Error adding document: ", error);
        }
    }
  }
}

</script>

<style>
    h1 {
        margin-top: 20px;
        text-align: left;
        margin-left: 40px;
    }

    .product-details-container {
        display: flex;
        justify-content: center;
        align-items: stretch;
        height: calc(100vh - 80px);
        padding: 50px;
        gap: 25px;
    }

    .left {
        flex: 1;
    }

    .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .add-listing-button {
        padding: 10px 20px;
        border: none;
        border-radius: 30px;
        background-color: #051e55;
        color: #fff;
        cursor: pointer;
        margin-top: 10px;
    }
</style>