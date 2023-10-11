// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyC2WIFmNrIn3p4jmcmXNCXOz5Y6a5Pbo",
    authDomain: "nsuconnect.firebaseapp.com",
    databaseURL: "https://nsuconnect-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nsuconnect",
    storageBucket: "nsuconnect.appspot.com",
    messagingSenderId: "889898728794",
    appId: "1:889898728794:web:a0d51d30aefbe2c2e3c763"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
        
// Set up our register function
signUp.addEventListener('click', (e) => {

// Get all our input fields
var fullname = document.getElementById('fullname').value
var email = document.getElementById('email').value
var password = document.getElementById('password').value

createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
     const user = userCredential.user;
        set(ref(database, 'users/' + user.uid), {
        fullname: fullname,
        email: email

        })

        // Alert and redirect to login.html
        alert('User created! Redirecting to login page...');
        window.location.href = 'login.html';
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          // ..
        });

    });
    

