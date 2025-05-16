<template>
  <div class="add-product">
    <h2>Add New Product</h2>
    <form @submit.prevent="submit" enctype="multipart/form-data">
      <input v-model="form.name" placeholder="Name" required />
      <input v-model="form.description" placeholder="Description" required />
      
      <input
        v-model.number="form.price"
        :placeholder="form.price === null ? 'Price' : ''"
        type="number"
        required
      />

      <input
        v-model.number="form.stock"
        :placeholder="form.stock === null ? 'Stock' : ''"
        type="number"
        required
      />

      <label for="category">Category:</label>
      <select id="category" v-model="form.category" required>
        <option disabled value="">Select Category</option>
        <option>Electronics</option>
        <option>Grocery</option>
        <option>Fashion</option>
        <option>Home</option>
        <option>Stationery</option>
      </select>

      <label for="imageInput">Select Image:</label>
      <input type="file" id="imageInput" @change="onFileChange" accept="image/*" required />

      <button type="submit" :disabled="loading">
        {{ loading ? "Adding..." : "Add Product" }}
      </button>

      <p v-if="success" class="success-message">Product added successfully!</p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>


<script>
import axios from "axios";
import { ref } from "vue";

export default {
  setup() {
    const form = ref({
  name: "",
  description: "",
  price: null,
  stock: null,
  category: ""
});
    const file = ref(null);

    const loading = ref(false);
    const success = ref(false);
    const error = ref("");

    const onFileChange = (e) => {
      file.value = e.target.files[0];
    };

    const submit = async () => {
      if (!file.value) {
        error.value = "Please select an image";
        return;
      }

      loading.value = true;
      success.value = false;
      error.value = "";

      try {
        const formData = new FormData();
        formData.append("name", form.value.name);
        formData.append("description", form.value.description);
        formData.append("price", form.value.price);
        formData.append("stock", form.value.stock);
        formData.append("category", form.value.category);
        formData.append("image", file.value);

        await axios.post("http://localhost:5000/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        success.value = true;
        // reset form & file input
        form.value = { name: "", description: "", price: 0, stock: 0, category: "" };
        file.value = null;
        document.getElementById("imageInput").value = null;
      } catch (err) {
        error.value = err.response?.data?.message || "Something went wrong!";
      } finally {
        loading.value = false;
        setTimeout(() => {
          success.value = false;
        }, 3000);
      }
    };

    return { form, loading, success, error, submit, onFileChange };
  },
};
</script>

<style scoped>
.add-product {
  max-width: 450px;
  margin: 40px auto;
  padding: 25px 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(32, 201, 151, 0.15);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #212529;
  font-weight: 700;
}

input {
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 18px;
  border: 1.8px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #20c997;
  box-shadow: 0 0 8px rgba(32, 201, 151, 0.3);
}

button {
  display: block;
  width: 100%;
  padding: 14px 0;
  background-color: #20c997;
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(32, 201, 151, 0.4);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #17b487;
  box-shadow: 0 8px 15px rgba(23, 180, 135, 0.6);
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

.success-message {
  color: #28a745;
  font-weight: 600;
  margin-top: 15px;
  text-align: center;
}

.error-message {
  color: #dc3545;
  font-weight: 600;
  margin-top: 15px;
  text-align: center;
}
select {
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 18px;
  border: 1.8px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

select:focus {
  outline: none;
  border-color: #20c997;
  box-shadow: 0 0 8px rgba(32, 201, 151, 0.3);
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  color: #495057;
}

</style>