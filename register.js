const firebaseConfig = {
  apiKey: "AIzaSyAyC2WIFmNrIn3p4jmcmXNCXOz5Y6a5Pbo",
  authDomain: "nsuconnect.firebaseapp.com",
  databaseURL: "https://nsuconnect-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nsuconnect",
  storageBucket: "nsuconnect.appspot.com",
  messagingSenderId: "889898728794",
  appId: "1:889898728794:web:e56b5592b25051aee3c763"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()

async function register() {
  // Get all our input fields
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var full_name = document.getElementById('full_name').value;

  // Validate input fields
  if (validate_email(email) === false || validate_password(password) === false) {
    alert('Email or Password Input Error!');
    return;
  }

  try {
    // Create user in Firebase Authentication
    var userCredential = await auth.createUserWithEmailAndPassword(email, password);

    // Get the current user
    var user = userCredential.user;

    // Add user data to Firebase Database
    var database_ref = database.ref('users/' + user.uid);
    var user_data = {
      email: email,
      full_name: full_name,
      login_status: 'offline'
    };

    await database_ref.set(user_data); // Wait for the database update to complete

    // User creation and database update successful
    alert('User Created!!');

    // Redirect to dash.html
    window.location.href = 'login.html';
  } catch (error) {
    // Handle errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}

// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}


