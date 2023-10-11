// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAyC2WIFmNrIn3p4jmcmXNCXOz5Y6a5Pbo",
    authDomain: "nsuconnect.firebaseapp.com",
    databaseURL: "https://nsuconnect-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nsuconnect",
    storageBucket: "nsuconnect.appspot.com",
    messagingSenderId: "889898728794",
    appId: "1:889898728794:web:a0d51d30aefbe2c2e3c763"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initialize database
const db = firebase.database();


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        const userEmail = user.email; // Get the user's email from Firebase Authentication

        // Use userEmail as the username in your chat application
        const username = userEmail.split('@')[0];

// submit form
// listen for submit event on the form and call the postChat function
document.getElementById("message-form").addEventListener("submit", sendMessage);

// send message to db
function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/" + timestamp).set({
    username,
    message,
  });
}

function top() {
    document.getElementById( 'top' ).scrollIntoView();    
};

function bottom() {
    document.getElementById( 'bottom' ).scrollIntoView();
    window.setTimeout( function () { top(); }, 2000 );
};
      
// display the messages
const fetchChat = db.ref("messages/");

// check for new messages using the onChildAdded event listener
fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const messageElement = document.createElement("li");

    // Set class based on sender (username)
    messageElement.className = username === messages.username ? "sent-message" : "received-message";

    // Create span elements for username and message
    const usernameSpan = document.createElement("span");
    usernameSpan.className = "username";
    usernameSpan.textContent = `${messages.username}: `;
    
    const messageSpan = document.createElement("span");
    messageSpan.className = "message-text";
    messageSpan.textContent = messages.message;

    // Append spans to the message element
    messageElement.appendChild(usernameSpan);
    messageElement.appendChild(messageSpan);

    // Append the message element to the messages container
    document.getElementById("messages").appendChild(messageElement);
  bottom();
});
    } else {
        alert('You need to login!');
    }
});


