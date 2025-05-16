import { createRouter, createWebHistory } from "vue-router";
import RevenueAnalysis from "./components/RevenueAnalysis.vue";
import InventoryManagement from "./components/InventoryManagement.vue";
import ProductRegistration from "./components/ProductRegistration.vue";

const routes = [
  { path: "/", component: RevenueAnalysis },
  { path: "/inventory", component: InventoryManagement },
  { path: "/register", component: ProductRegistration }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
