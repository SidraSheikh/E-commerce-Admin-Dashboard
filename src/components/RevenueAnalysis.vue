<template>
  <div class="revenue-dashboard">
    <h2>Revenue Dashboard</h2>

    <label for="categoryFilter" class="filter-label">Filter by Category:</label>
    <select v-model="selectedCategory" @change="fetchData" id="categoryFilter" class="category-select">
      <option value="">All Categories</option>
      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
    </select>

    <div class="summary">
      <div class="card">
        <h3>Total Orders</h3>
        <p>{{ data.totalOrders ?? 0 }}</p>
      </div>
      <div class="card">
        <h3>Total Sales</h3>
        <p>${{ data.totalSales ?? 0 }}</p>
      </div>
    </div>

    <div class="tabs">
      <button
        v-for="(label, key) in trendLabels"
        :key="key"
        :class="['tab-btn', { active: activeTab === key }]"
        @click="activeTab = key"
      >
        {{ label }}
      </button>
    </div>

    <div class="chart-container">
      <canvas v-for="(label, key) in trendLabels" 
              :key="key" 
              v-show="activeTab === key" 
              :id="`chart-${key}`"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, nextTick, watch } from "vue";
import Chart from "chart.js/auto";

export default {
  setup() {
    const data = ref({});
    const selectedCategory = ref("");
    const categories = ref(["Electronics", "Grocery", "Fashion","Home","Stationery"]);
    const trendLabels = {
      daily: "Daily Sales",
      weekly: "Weekly Sales",
      monthly: "Monthly Sales",
      annually: "Annual Sales",
    };
    const activeTab = ref("daily"); 
    let chartInstances = {};

    const generateLabelsForTrend = (trendKey) => {
      switch (trendKey) {
        case "daily":
          return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        case "weekly":
          return ["Week 1", "Week 2", "Week 3", "Week 4"];
        case "monthly":
          return ["Jan", "Feb", "Mar", "Apr"];
        case "annually":
          return ["2019", "2020", "2021", "2022"];
        default:
          return [];
      }
    };

    const fetchData = async () => {
      const url = selectedCategory.value
        ? `http://localhost:5000/api/revenue?category=${selectedCategory.value}`
        : "http://localhost:5000/api/revenue";

      const res = await axios.get(url);
      data.value = res.data;

      await nextTick();

      Object.values(chartInstances).forEach((c) => c.destroy());
      chartInstances = {};

      Object.entries(trendLabels).forEach(([key, label]) => {
        if (!data.value.trends || !data.value.trends[key]) return;

        const ctx = document.getElementById(`chart-${key}`).getContext("2d");
        chartInstances[key] = new Chart(ctx, {
          type: "line",
          data: {
            labels: generateLabelsForTrend(key),
            datasets: [
              {
                label,
                data: data.value.trends[key],
                borderColor: "#20c997",
                backgroundColor: "rgba(32, 201, 151, 0.2)",
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#20c997",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: { color: "#666" },
                grid: { color: "#eee" },
              },
              y: {
                ticks: { color: "#666" },
                grid: { color: "#eee" },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "#333",
                  font: {
                    size: 14,
                  },
                },
              },
            },
          },
        });
      });
    };

    onMounted(fetchData);
    watch(selectedCategory, fetchData);

    return { data, categories, selectedCategory, trendLabels, activeTab, fetchData };
  },
};
</script>

<style scoped>
.revenue-dashboard {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
}

h2 {
  text-align: center;
  color: #212529;
  margin-bottom: 20px;
}

.filter-label {
  font-weight: 600;
  margin-right: 10px;
  color: #333;
}

.category-select {
  padding: 6px 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  margin-bottom: 25px;
  transition: border-color 0.3s ease;
}

.category-select:focus {
  outline: none;
  border-color: #20c997;
  box-shadow: 0 0 8px rgba(32,201,151,0.3);
}

.summary {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  flex: 1;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
}

.card h3 {
  color: #495057;
  margin-bottom: 10px;
}

.card p {
  font-size: 24px;
  font-weight: bold;
  color: #20c997;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 18px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  color: #555;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #20c997;
}

.tab-btn.active {
  color: #20c997;
  border-bottom-color: #20c997;
  font-weight: 700;
}

.chart-container {
  position: relative;
  height: 280px;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
}
</style>
