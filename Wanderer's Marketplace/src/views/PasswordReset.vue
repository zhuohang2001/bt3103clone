<template>
    <div class="container">
      <div class="login-logo">
        <img src="/images/logo_with_words.png" alt="Logo">
      </div>
      <div class="login-form">
        <h2>Password Reset</h2>
        <p class = "grey-text">Enter your email address to reset your password</p>
        <label for="email">Email Address </label><br>
        <input type="email" id="email" name="email" class = "input-field" v-model="email"><br><br>
        <button class="login-button" @click = "resetPassword()">Reset Password</button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="additional-text">
          <p>Don't have an account?<router-link to="/createaccount" class="signup-link">Sign up here</router-link></p>
          <p>Remember your password?<router-link to="/" class="signup-link">Login here</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail} from "firebase/auth";
  import app from "../firebase.js";
  export default {
    name: 'PasswordReset',
    data() {
      return {
        email: '',
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
      async resetPassword() {
        try {
          const auth = getAuth();
          // Clear previous error message
          this.error = null;
          // Send password reset email
          await sendPasswordResetEmail(auth, this.email);
          // Clear email field
          this.email = '';
          // Show success message or redirect user
          alert('Password reset email sent! Check your inbox.');
        } catch (error) {
          // Handle errors
          this.error = error.message;
          console.error('Error sending password reset email:', error.message);
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
  
  .login-form {
    flex: 1; /* Take up remaining space */
    position: relative;
    text-align: center;
    width: 300px;
  }
  
  .login-form::before {
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
    font-size: 14px;
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
  .signup-link {
    color: #051E55;
    font-size: 15px;
  }
  </style>