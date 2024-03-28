<template>
    <div class="container">
      <div class="login-logo">
        <img src="/images/logo_with_words.png" alt="Logo">
      </div>
      <div class="signup-form">
        <h2>Create Your Account</h2>
        <label for="email">Email Address</label><br>
        <input type="email" id="email" name="email" class="input-field" v-model="email"><br><br>
        <label for="password">Password</label><br>
        <input type="password" id="password" name="password" class="input-field" v-model="password"><br><br>
        <label for="confirmPassword">Confirm Password</label><br>
        <input type="password" id="confirmPassword" name="confirmPassword" class="input-field" v-model="confirmPassword"><br><br>
        <label for="country">Country</label><br>
        <select id="country" name="country" class="input-field" v-model="country">
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
          <!-- Add more options as needed -->
        </select><br><br>
        <label for="cardholderName">Cardholder Name</label><br>
        <input type="text" id="cardholderName" name="cardholderName" class="input-field" v-model="cardholderName"><br><br>
        <label for="cardNumber">Card Number</label><br>
        <input type="text" id="cardNumber" name="cardNumber" class="input-field" v-model="cardNumber"><br><br>
        <div class="row">
          <div class="col">
            <label for="CVV">CVV</label><br>
            <input type="text" id="CVV" name="CVV" class="input-field" v-model="CVV"><br><br>
          </div>
          <div class="col">
            <label for="expiryDate">Expiry Date</label><br>
            <input type="text" id="expiryDate" name="expiryDate" class="input-field" v-model="expiryDate"><br><br>
          </div>
        </div>
        <label for="telegramHandle">Telegram Handle</label><br>
        <input type="text" id="telegramHandle" name="telegramHandle" class="input-field" v-model="telegramHandle"><br><br>
        <button class="createaccount-button" @click="login()">Create Account</button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="additional-text">
          <p>Already have an account?<router-link to="/" class="login-link" >Login here</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
  import app from "../firebase.js";
  
  export default {
    name: 'CreateAccount',
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        cardholderName: '',
        cardNumber: '',
        CVV: '',
        expiryDate: '',
        telegramHandle: '',
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
          // Call the Firebase createUserWithEmailAndPassword method to create a new user
          const auth = getAuth();
          await createUserWithEmailAndPassword(auth, this.email, this.password);
          // If account creation is successful, redirect to home or login page
          this.$router.push('/home');
        } catch (error) {
          // Handle account creation errors here
          this.error = error.message;
          console.error('Error creating account:', error.message);
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
  form {
    text-align: center;
    align-items: center;
    margin: auto;
  }
  
  .input-field {
    width: 300px; /* Adjust the width of the input fields */
    box-sizing: border-box;
  }
  
  .createaccount-button {
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

  .login-link {
    font-size: 15px;
    color:#051E55;
  }
  
  .row {
    display: flex;
  }
  
  .col {
    flex: 1;
    margin: 0 20px; /* Adjust margin as needed */
  }
  #CVV, #expiryDate {
    width: 100px; /* Calculate width to fit within half of the container width */
  }
  
  </style>
  