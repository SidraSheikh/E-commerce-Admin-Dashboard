<template>
  <div>
    <nav class="navbar">
      <router-link to="/" class="nav-link">Revenue</router-link>
      <router-link to="/inventory" class="nav-link">Inventory</router-link>
      <router-link to="/register" class="nav-link">Register</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  background-color: #20c997;
  padding: 1rem;
  border-bottom: 3px solid #198754;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 3px;
}

.nav-link:hover {
  color: #fff;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 2px;
  left: 0;
  bottom: 0;
  background-color: white;
  transition: 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}
</style>
