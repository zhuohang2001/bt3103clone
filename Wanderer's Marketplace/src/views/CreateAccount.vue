<template>
    <div class="container">
      <div class="login-logo">
        <img src="/images/logo_with_words.png" alt="Logo">
      </div>
      <div class="signup-form">
        <h2>Create Your Account</h2>
        <label for="email">Email Address </label><br>
        <input type="email" id="email" name="email" class = "input-field" v-model="email"><br><br>
        <label for="password">Password </label><br>
        <input type="password" id="password" name="password" class = "input-field" v-model="password"><br><br>
        <input type="checkbox" id="rememberMe" name="rememberMe">
        <label for="rememberMe"> Remember me</label><br><br>
        <button class="login-button" @click = "login()">Login</button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="additional-text">
          <p>Don't have an account? Sign up here</p>
          <p>Forgot password? Reset here</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
  import app from "../firebase.js";
  export default {
    name: 'CreateAccount',
    data() {
      return {
        email: '',
        password: '',
        error: '',
        user: null,
      };
    },
    mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        console.log("Authentication state changed: ", user.email);
        if (user) {
          this.user = user;
          console.log('User is logged in');
        } else {
          console.log("User is not logged in.")
        }
      })  
    },
    methods: {
      async login() {
        try {
          // Call the Firebase signInWithEmailAndPassword method to authenticate the user
          const auth = getAuth();
          await signInWithEmailAndPassword(auth, this.email, this.password)
          // If authentication is successful, redirect to home
          this.$router.push('/home');
        } catch (error) {
          // Handle authentication errors here
          this.error = error.message;
          console.error('Error signing in:', error.message);
        }
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
    width: 70%; /* Make sure image fills its container */
    height: auto; /* Maintain aspect ratio */
  }
  
  .signup-form {
    flex: 1; /* Take up remaining space */
    position: relative;
    text-align: center;
    width: 300px;
  }
  
  .signup-form::before {
    content: '';
    position: absolute;
    top: -20px;
    bottom: -30px;
    left: calc( 7%); /* Adjust the position of the line */
    width: 2px; /* Width of the line */
    background-color: #051E55; /* Color of the line */
  }
  .grey-text{
    color: #717171;
  }
  
  form{
    text-align: center;
    align-items: center;
    margin: auto;
  }
  .input-field {
    width: 300px; /* Adjust the width of the input fields */
    box-sizing: border-box;
  }
  
  .login-button {
    padding: 10px 20px;
    background-color: #051E55;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    width: 300px;
  }
  
  .additional-text {
    text-align: center;
  }
  </style>