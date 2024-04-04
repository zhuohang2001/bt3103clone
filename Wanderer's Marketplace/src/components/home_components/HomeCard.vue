<template>
    <div class="product-card">
      <img :src="product.imageUrl" alt="Product image" class="product-image">
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p :class="statusClass">{{ product.status }}</p>
      </div>
    </div>
</template>

<script>
    export default {
    props: {
        product: Object,
    },
    computed: {
        statusClass() {
        return {
            'product-status': true, // Always apply this class
            'status-available': this.product.status === 'Available', // Apply this class if status is 'available'
            'status-accepted': this.product.status === 'Accepted', // Apply this class if status is 'accepted'
            'status-purchased': this.product.status === 'Purchased', // Apply this class if status is 'purchased'
            'status-completed': this.product.status === 'Completed', // Apply this class if status is 'completed'
        };
        },
    },
    };
</script>

<style scoped>
    .product-card {
        display: flex;
        flex-direction: column;
        min-height: 150px;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        width: 200px;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .product-image {
        width: 100%;
        object-fit: cover;
        height: 200px;
    }

    .product-info {
        padding: 16px;
        text-align: center;
    }

    .product-name {
        font-size: 1rem;
        color: #333;
        margin-bottom: 8px;
        word-wrap: break-word;
    }

    .product-status {
        font-size: 0.8rem;
        /* Remove color property from here */
    }

    /* Define color classes based on status */
    .status-available {
        color: darkblue;
    }

    .status-accepted {
        color: #fc6a03;
    }

    .status-purchased {
        color: red;
    }

    .status-completed {
        color: green;
    }
</style>