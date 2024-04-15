<template>
  <div class="container">
    <div class="login-logo">
      <img src="/images/logo_with_words.png" alt="Logo">
    </div>
    <div class="login-form">
      <h2>Account Login</h2>
      <div class = "form-group">
        <p class = "grey-text">If you are already a member, please login with<br>your email address and password.</p>
      </div>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" class="input-field" v-model="email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" class="input-field" v-model="password">
      </div>
      <div class="form-group">
        <div class="remember-me">
          <input type="checkbox" id="rememberMe" name="rememberMe"  @change="toggleRememberMe" >
          <label for="rememberMe"> Remember me</label>
        </div>
      </div>
      <button class="login-button" @click = "login()">Login</button>
      <div v-if="error" class="error-box">{{ error }}</div>
      <div class="additional-text">
        <p>Don't have an account?<router-link to="/createaccount" class="signup-link">Sign up here</router-link></p>
        <p>Forgot password?<router-link to="/passwordreset" class="reset-link">Reset here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import app from "../firebase.js";
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      error: '',
      user: null,
    };
  },
  mounted() {
    // Retrieve email and password from local storage if they exist
    const storedEmail = localStorage.getItem('storedEmail');
    const storedPassword = localStorage.getItem('storedPassword');
    if (storedEmail && storedPassword) {
      this.email = storedEmail;
      this.password = storedPassword;
    }
    // Check if "Remember Me" is checked in local storage
    const rememberMeStored = localStorage.getItem('rememberMe');
    this.rememberMe = rememberMeStored === 'true';  // Directly set rememberMe to true or false
    this.$nextTick(() => {
    // This code will run after Vue has updated the DOM based on the above changes
      document.getElementById('rememberMe').checked = this.rememberMe;
    });
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log("Authentication state changed: ", user.email);
      if (user) {
        this.user = user;
        this.$store.dispatch('fetchUser', user);
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
        const { user } = await signInWithEmailAndPassword(auth, this.email, this.password); // Destructure user from the response

        if (!user.emailVerified) {
            throw new Error("Please verify your email.");
        }
        
        // Store email and password if "Remember Me" is checked
        if (this.rememberMe) {
          localStorage.setItem('storedEmail', this.email);
          localStorage.setItem('storedPassword', this.password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          // Clear stored email and password if "Remember Me" is unchecked
          localStorage.removeItem('storedEmail');
          localStorage.removeItem('storedPassword');
          localStorage.removeItem('rememberMe');
        }
        
        // If authentication is successful, redirect to home
        this.$router.push('/home');
      } catch (error) {
        // Handle authentication errors here
        if (error.code === 'auth/invalid-email') {
          this.error = "Invalid Email Address"; // Custom error message for invalid email
        } else if (error.code === 'auth/missing-password') {
          this.error = "Missing Password"; // Custom error message for missing password
        } else if (error.code === 'auth/wrong-password') {
          this.error = "Invalid password"; // Custom error message for wrong password
        } else if (error.code === 'auth/invalid-credential') {
          this.error = "Invalid Email Address/Password"; // Custom error message for invalid credential
        } else {
          this.error = error.message; // Use default error message for other errors
        }
        console.error('Error signing in:', error.code, error.message);
      }
    },
    toggleRememberMe() {
      this.rememberMe = !this.rememberMe;
      console.log('Check box:', this.rememberMe)
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
  flex: 60%;
  max-width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.login-logo img {
  max-width: 60%; /* Make sure image fills its container */
  height: auto; /* Maintain aspect ratio */
}

.login-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Align items vertically at the center */
  align-items: center; /* Align items horizontally at the center */
}

.login-form::before {
  content: '';
  position: absolute; 
  top: 10px;
  bottom: auto;
  left: 0%;
  margin-left: -7%; /* Adjusted position of the line */
  width: 2px; /* Width of the line */
  background-color: #051E55; /* Color of the line */
  height: 100%;
}

.grey-text{
  color: #717171;
}

/*form{
  text-align: center;
  align-items: center;
  margin: auto;
}
*/
.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 20px;
  align-items: flex-start;
}

.form-group label {
  margin-bottom: 5px;
}
.input-field {
  width: 300px; /* Adjust the width of the input fields */
  box-sizing: border-box;
  margin: 0 auto;
  padding-left: 0;
}
.remember-me {
  display: flex;
  flex-direction: row; 
  align-items: flex-start;
  margin-left: 0;
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
.additional-text {
  text-align: center;
}
.signup-link,.reset-link {
  color: #051E55;
  font-size: 15px;
  font-weight: bold;
}

</style>