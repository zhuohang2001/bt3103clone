<script>
  export default{
    name: 'App' 
  }
</script>

<template>
  <div id="app">
    <div id ="nav">
      <router-link to = "/"> Home </router-link> |
      <router-link to = "/marketplace"> Marketplace </router-link>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
  }

  #nav{
    padding : 10px;
  }

  #nav a {
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    font-weight: bold;
    color: #051e55;
  }
</style>
