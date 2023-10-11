// Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
    import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
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

document.addEventListener('DOMContentLoaded', function() {
  const userWelcomeMessage = document.getElementById('userWelcomeMessage');

  // Firebase authentication listener
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      const displayName = user.email; // Get the display name of the logged-in user
      userWelcomeMessage.textContent = `Hello, "${displayName}"`;
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Get the sign-out button by ID
  const signOutButton = document.getElementById('signOutButton');

  // Add event listener to the sign-out button
  signOutButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the button
    
    // Sign the user out
    auth.signOut()
      .then(() => {
          window.location.href = 'login.html';
      })
      .catch((error) => {
        alert('Error Logging out! Try Again Later...');
        console.error(error); // Log the error for debugging
      });
  });
});

//loginStatus
document.addEventListener('DOMContentLoaded', function() {
  const userStatus = document.getElementById('userStatus');

  // Firebase authentication listener
  auth.onAuthStateChanged(function(user) {
    if (!user) {
        // User is not logged in, redirect to the login page
        alert('User not logged in! Redirecting to login...');
        window.location.href = "login.html";
    }
  });
});
