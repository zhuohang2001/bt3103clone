<template>
  <div class="container">
    <div class="login-logo">
      <img src="/images/logo_with_words.png" alt="Logo">
    </div>
    <div class="login-form">
      <h2>Account Login</h2>
      <h5 class = "grey-text">If you are already a member, please login <br> with your email adddress and password.</h5>
      <label for="email">Email Address </label><br>
      <input type="email" id="email" name="email" class = "input-field"><br><br>
      <label for="password">Password </label><br>
      <input type="password" id="password" name="password" class = "input-field"><br><br>
      <input type="checkbox" id="rememberMe" name="rememberMe">
      <label for="rememberMe">Remember me</label><br><br>
      <button class="login-button" @click = "login">Login</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loggedIn: false
    };
  },
  methods: {
    login() {
      // Logic for login, then set loggedIn to true
      this.loggedIn = true;
      // Perform login logic here
      this.$router.push('/home');
    }
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center; /* Align center horizontally */
  align-items: center; /* Align center vertically */
  height: 100vh; /* Ensure container takes up full viewport height */
}

.login-logo {
  width: 50%;
}

.login-logo img {
  width: 100%; /* Make sure image fills its container */
  height: auto; /* Maintain aspect ratio */
}

.login-form {
  flex: 1; /* Take up remaining space */
  background-color: #b3e3eb;
}
.grey-text{
  color: #717171;
}
.login-form{
  display: inline-block;
  text-align: left;
}

form{
  text-align: center;
  align-items: center;
  margin: auto;
}
.input-field {
  width: 300px; /* Adjust the width of the input fields */
}

.login-button {
  padding: 10px 20px;
  background-color: #051E55;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>
