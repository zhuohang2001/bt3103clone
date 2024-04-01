<template>
    <div class="container">
      <div class="login-logo">
        <img src="/images/logo_with_words.png" alt="Logo">
      </div>
      <div class="signup-form">
        <h2>Create Your Account</h2>
        <label for="username">Username</label><br>
        <input type="text" id="username" name="username" class="input-field" v-model="username"><br><br>
        <label for="email">Email Address</label><br>
        <input type="email" id="email" name="email" class="input-field" v-model="email"><br><br>
        <label for="password">Password</label><br>
        <input type="password" id="password" name="password" class="input-field" v-model="password"><br><br>
        <label for="confirmPassword">Confirm Password</label><br>
        <input type="password" id="confirmPassword" name="confirmPassword" class="input-field" v-model="confirmPassword"><br><br>
        <span v-if="passwordsMatch" class="password-match">Passwords match!</span>
        <span v-else-if="confirmPassword !== '' && confirmPassword !== password" class="password-mismatch">Passwords do not match!</span>
        <br v-if="password !== '' && confirmPassword !== ''"><br> <!-- Render gap only when passwords are filled -->
        <!--<label for="country">Country</label><br>
        <select id="country" name="country" class="input-field" v-model="country">
          <option v-for="(countryName, countryCode) in countryNames" :value="countryCode" :key="countryCode">{{ countryName }}</option>
        </select><br><br>
        -->
        <label for="cardholderName">Cardholder Name</label><br>
        <input type="text" id="cardholderName" name="cardholderName" class="input-field" v-model="cardholderName"><br><br>
        <label for="cardNumber">Card Number</label><br>
        <input type="text" id="cardNumber" name="cardNumber" class="input-field" v-model="cardNumber"><br><br>
        <label for="CVV">CVV</label><br>
        <input type="text" id="CVV" name="CVV" class="input-field" v-model="CVV"><br><br>
        <label for="expiryDate">Expiry Date</label><br>
        <input type="month" id="expiryDate" name="expiryDate" class="input-field" v-model="expiryDate"><br><br>
        <label for="telegramHandle">Telegram Handle</label><br>
        <input type="text" id="telegramHandle" name="telegramHandle" class="input-field" v-model="telegramHandle"><br><br>
        <button class="createaccount-button" @click="signUp($event)">Create Account</button>
        <div class="error-box" v-if="error">
          <div class="error-message">{{ error }}</div>
        </div>
        <div class="additional-text">
          <p>Already have an account?<router-link to="/" class="login-link" >Login here</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
  import {countries} from 'countries-list';
  import app from "../firebase.js";
  import firebaseApp from '../firebase.js';
  import { getFirestore } from 'firebase/firestore';
  import { doc, setDoc } from 'firebase/firestore';
  const db = getFirestore(firebaseApp);
  
  export default {
    name: 'CreateAccount',
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        //country: '',
        countryNames: [],
        cardholderName: '',
        cardNumber: '',
        CVV: '',
        expiryDate: '',
        telegramHandle: '',
        error: '',
        user: null,
      };
    },
    computed: {
      passwordsMatch() {
        return this.confirmPassword !== '' && this.confirmPassword === this.password;
      }
    },
    mounted() {
      //this.countryNames = Object.values(countries).map(country => country.name);
      //this.countryNames.sort();
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
      isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      async signUp() {
        event.preventDefault();
        try {
          // Check if the username is empty or contains only spaces
          if (!this.username || this.username.trim() === '') {
            throw new Error("Please provide a valid username.");
          }
          // Check if the email address is valid
          if (!this.isValidEmail(this.email)) {
            throw new Error("Invalid email format. Please provide a valid email address.");
          }
          // Check if the password is empty or contains only spaces
          if (!this.password || this.password.trim() === '') {
            throw new Error("Please provide a valid password.");
          }
          // Check if the password and confirm password match
          if (this.password !== this.confirmPassword) {
            throw new Error("Passwords do not match!");
          }
          // Check if the cardholder name is empty or contains only spaces
          if (!this.cardholderName || this.cardholderName.trim() === '') {
            throw new Error("Please provide a valid cardholder name.");
          }
          // Check if the card number is empty or contains only spaces
          if (!this.cardNumber || this.cardNumber.trim() === '') {
            throw new Error("Please provide a valid card number.");
          }
          // Check if the card number contains only numbers
          if (!/^\d+$/.test(this.cardNumber)) {
            throw new Error("Card number must contain numbers only.");
          }
          // Check if the CVV is empty or contains only spaces
          if (!this.CVV || this.CVV.trim() === '') {
            throw new Error("Please provide a valid CVV.");
          }
          // Check if CVV has exactly three digits
          if (!/^\d{3}$/.test(this.CVV)) {
            throw new Error("CVV must be a 3-digit number.");
          }
          // Check if the expiry date is filled in
          if (!this.expiryDate) {
            throw new Error("Please provide an expiry date.");
          }
          // Check if the telegram handle is empty or contains only spaces
          if (!this.telegramHandle || this.telegramHandle.trim() === '') {
            throw new Error("Please provide a valid Telegram handle.");
          }
          // Call the Firebase createUserWithEmailAndPassword method to create a new user
          const auth = getAuth();
          const { user } = await createUserWithEmailAndPassword(auth, this.email, this.password);

          // Save user details to Firestore
          //const db = app.firestore();
          await setDoc(doc(db, "Users", user.uid), {
            username: this.username,
            email: this.email,
            cardholderName: this.cardholderName,
            cardNumber: this.cardNumber,
            CVV: this.CVV,
            expiryDate: this.expiryDate,
            telegramHandle: this.telegramHandle
          });
          // If account creation is successful, redirect to home or login page
          this.$router.push('/home');
        } catch (error) {
          // Handle account creation errors here
          if (error.code === 'auth/invalid-email') {
            this.error = "Invalid email format. Please provide a valid email address."; // Custom error message for invalid email
          } else if (error.code === 'auth/weak-password') {
            this.error = "Password should be at least 6 characters long."; // Custom error message for weak password
          } else if (error.code === 'auth/email-already-in-use') {
            this.error = "The email address is already in use. Please use a different email address."; // Custom error message for email already in use
          } 
          else {
            this.error = error.message; // Use default error message for other errors
          }
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
  .error-box {
  background-color: #ffcccc; /* Red background color */
  border: 1px solid #ff3333; /* Red border */
  border-radius: 4px; /* Rounded corners */
  padding: 8px 20px; /* Add some padding */
  margin-top: 20px; /* Add some space above the error box */
  width: 260px;
  font-size: 14px;
  margin: 20px auto;
}

.error-message {
  color: #ff3333; /* Red text color */
}
  
  .additional-text {
    text-align: center;
  }

  .login-link {
    font-size: 15px;
    color:#051E55;
  }
  </style>
  