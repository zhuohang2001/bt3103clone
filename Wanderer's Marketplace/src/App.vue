<template>
  <div id="app">
    <div id ="nav" >
      <img id="LogoTopLeft" src="/images/logo_with_words_2.png" alt="">
      <div id="nav-links">
        <router-link to = "/home"> Home </router-link> |
        <router-link to = "/marketplace"> Marketplace </router-link> |
        <router-link to = "/profile"> Profile </router-link>
      </div>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'App' ,
    data() {
      return {
        loggedIn: false
      }
    }
  }
</script>

<style>
  #LogoTopLeft {
    height: 80px;
  }
  
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  #nav {
    padding : 10px;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 15px;
    margin-left: 15px;
  }

  #nav-links {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  #nav a {
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    font-weight: bold;
    color: #051e55;
  }
</style>
