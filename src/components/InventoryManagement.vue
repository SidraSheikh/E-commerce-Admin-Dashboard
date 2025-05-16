<template>
  <div class="inventory">
    <h2>Inventory</h2>
    <input
      v-model="search"
      placeholder="Search products..."
      class="search-input"
      autocomplete="off"
    />

    <ul class="product-list">
      <li
    v-for="product in filteredProducts"
    :key="product._id"
    :class="['product-item', { 'low-stock': product.stock <= 5 }]"
  >
    <span>
      <strong>{{ product.name }}</strong> (Stock: {{ product.stock }})
    </span>
    <button @click="restock(product)" class="restock-btn">+ Restock</button>
  </li>
</ul>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const products = ref([]);
    const search = ref("");

    onMounted(async () => {
      const res = await axios.get("http://localhost:5000/api/products");
      products.value = res.data;
    });

    const filteredProducts = computed(() =>
      products.value.filter((p) =>
        p.name.toLowerCase().includes(search.value.toLowerCase())
      )
    );

    const restock = async (product) => {
      const newStock = product.stock + 10;
      await axios.put(`http://localhost:5000/api/products/${product._id}`, {
        ...product,
        stock: newStock,
      });
      product.stock = newStock;
    };

    return { products, search, filteredProducts, restock };
  },
};
</script>

<style scoped>
.inventory {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(32, 201, 151, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #212529;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 10px;
  margin-bottom: 25px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #20c997;
  box-shadow: 0 0 8px rgba(32, 201, 151, 0.3);
}

.product-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.product-item:hover {
  background-color: #f0fefb;
}

.restock-btn {
  background-color: #20c997;
  border: none;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(32, 201, 151, 0.3);
}

.restock-btn:hover {
  background-color: #17b487;
  box-shadow: 0 6px 14px rgba(23, 180, 135, 0.5);
}
.product-item.low-stock {
  background-color: #ffe6e6;
  border-left: 6px solid #dc3545;
}
</style>