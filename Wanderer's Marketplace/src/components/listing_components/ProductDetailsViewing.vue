<template>
    <div class="product-details">
        <form id="myform">
            <div class="title">Product Details</div>
            <div class="header">Product Name</div>
            <div class="input-row">
                <input
                    type="text"
                    v-model="productDetails.name"
                    id="productName"
                    placeholder="Product Name"
                    required=""
                    readonly
                />
            </div>
            <div class="header">Purchase Quantity, Colour and Size</div>
            <div class="input-row">
                <input
                    type="number"
                    v-model.number="productDetails.quantity"
                    id="quantity"
                    placeholder="Quantity"
                    required=""
                    readonly
                />
                <input type="text" v-model="colour" placeholder="Colour" id="colour" readonly/>
                <input type="text" v-model="size" placeholder="Size" id="size" readonly/>
            </div>
            <div class="header">Purchase Currency, Minimum Product Price and Maximum Product Price</div>
            <div class="input-row">
                <input type="text" v-model="currency" placeholder="Currency" id="currency" readonly/>
                <input
                    type="number"
                    step="0.01"
                    v-model.number="productDetails.minPrice"
                    id="minProductPrice"
                    placeholder="Min. Product Price"
                    required=""
                    readonly
                />
                <input
                    type="number"
                    step="0.01"
                    v-model.number="productDetails.maxPrice"
                    id="maxProductPrice"
                    placeholder="Max. Product Price"
                    required=""
                    readonly
                />
            </div>
            <div class="header">Delivery Fee and Country of Purchase</div>
            <div class="input-row">
                <input
                    type="number"
                    step="0.01"
                    v-model="productDetails.deliveryPrice"
                    id="deliveryFee"
                    placeholder="Delivery Fee"
                    required=""
                    readonly
                />
                <input type="text" v-model="country" placeholder="Country" required="" id="country" readonly />
            </div>
            <div class="header">Preferred Estimated Delivery Date</div>
            <div class="input-row">
                <input
                    type="date"
                    v-model="productDetails.deliveryDate"
                    id="estimatedDeliveryDate"
                    placeholder="Estimated Delivery Date"
                    required=""
                    readonly
                />
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        productDetails: {
            type: Object,
            default: () => ({
                name: "",
                quantity: null,
                colour: "",
                size: "",
                currency: "",
                minPrice: null,
                maxPrice: null,
                deliveryDate: "",
                country: "",
            }),
        },
    },
};
</script>

<style scoped>
.product-details {
    background-color: #fff1e7;
    border-radius: 20px;
    padding: 1rem;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    width: 90%;
}

.title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: left;
}

.header {
    font-size: 0.8rem;
    text-align: left;
}

.input-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.input-row input {
    flex: 1;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #f9f9f9; /* Optional: to visually indicate the field is not editable */
}
</style>