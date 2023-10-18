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

document.addEventListener('DOMContentLoaded', function() {
  const userWelcomeMessage = document.getElementById('userWelcomeMessage');

  // Firebase authentication listener
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      const displayName = user.email; // Get the display name of the logged-in user
      userWelcomeMessage.textContent = `${displayName}`;
      userWelcomeMessage.style.color = 'blue';
    }
  });
});

// Handle SignOut
document.addEventListener('DOMContentLoaded', function() {
  // Get the sign-out button by ID
  const signOutButton = document.getElementById('signOutButton');

  // Add event listener to the sign-out button
  signOutButton.addEventListener('click', async function(event) {
   
    try {
      // Get the current user
      var user = auth.currentUser;

      // Update user login_status to 'offline' in Firebase Database      
        var database_ref = database.ref('users/' + user.uid);
        await database_ref.update({
          login_status: 'offline'
        });
      
      // Sign the user out
      await auth.signOut();      

      // Redirect to login.html after successful sign-out and database update
      window.location.href = 'login.html';
    } catch (error) {
      // Handle errors
      alert('Error Logging out! Try Again Later...');
      console.error(error); // Log the error for debugging
    }
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


// Handling Chatroom
firebase.auth().onAuthStateChanged(function (user) {
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
      database.ref("messages/" + timestamp).set({
        username,
        message,
        timestamp
      });
    }

    function top() {
      document.getElementById('top').scrollIntoView();
    };

    function bottom() {
      document.getElementById('bottom').scrollIntoView();
      window.setTimeout(function () { top(); }, 2000);
    };
      
    // display the messages
    const fetchChat = database.ref("messages/");

    // check for new messages using the onChildAdded event listener
    fetchChat.on("child_added", function (snapshot) {
      const messages = snapshot.val();
      const messageElement = document.createElement("li");

      // Set class based on sender (username)
      messageElement.className = username === messages.username ? "sent-message" : "received-message";

      // Create span elements for username, timestamp, and message
      const usernameSpan = document.createElement("span");
      usernameSpan.className = "username";
      usernameSpan.textContent = `[${formatTimestamp(messages.timestamp)}] ${messages.username} : `;      
      
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

    // Function to format timestamp into human-readable format
    function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  }
})


//handle online user list
document.addEventListener('DOMContentLoaded', function() {
  const userlist = document.getElementById('user_list');

  // Reference to the 'users' node in your Firebase Realtime Database
  const usersRef = database.ref('users');

  // Listen for real-time updates on users with login_status: online
  usersRef.orderByChild('login_status').equalTo('online').on('value', function(snapshot) {
    userlist.innerHTML = ''; // Clear the user list before updating

    // Check if there are users
    if (snapshot.exists()) {
      snapshot.forEach(function(childSnapshot) {
        const user = childSnapshot.val();
        const userEmail = user.email;

        // Create a list item for each user email
        const listItem = document.createElement('li');
        listItem.textContent = userEmail;
        userlist.appendChild(listItem);
      });
    } else {
      userlist.textContent = 'No users available.';
    }
  });
});


//handle whisper
document.addEventListener('DOMContentLoaded', function() {
  const whisperForm = document.getElementById('whisper-form');
  const whisperRecipientInput = document.getElementById('whisper-recipient');
  const whisperMessageInput = document.getElementById('whisper-message');

  whisperForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const recipientEmail = whisperRecipientInput.value.trim();
    const message = whisperMessageInput.value.trim();

    if (recipientEmail && message) {
      // Create a new node 'whispers' in your Firebase Realtime Database
      const whispersRef = database.ref('whispers');
      const whisperData = {
        sender: currentUser.email, // Assuming you have currentUser object or access to sender's email
        recipient: recipientEmail,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      // Store the whisper message in the 'whispers' node
      const newWhisperRef = whispersRef.push(whisperData);

      // Open a chat window with the recipient using the new whisper key
      openChatWindow(recipientEmail, newWhisperRef.key);

      // Clear input fields
      whisperRecipientInput.value = '';
      whisperMessageInput.value = '';
    } else {
      alert('Recipient and message cannot be empty.');
    }
  });

  // Function to open a chat window with the recipient
  function openChatWindow(recipientEmail, whisperKey) {
    // Create a chat box element
    const chatBox = document.createElement('div');
    chatBox.className = 'chat-box';
    chatBox.innerHTML = `
      <div class="chat-header">
        Chat with ${recipientEmail}
        <button class="close-chat-btn">Close</button>
      </div>
      <ul class="chat-messages" id="chat-messages-${whisperKey}"></ul>
      <input type="text" id="chat-input-${whisperKey}" placeholder="Type your message...">
      <button class="send-chat-btn" data-whisper-key="${whisperKey}">Send</button>
    `;

    // Add chat box to the document body
    document.body.appendChild(chatBox);

    // Get chat input and send button
    const chatInput = document.getElementById(`chat-input-${whisperKey}`);
    const sendButton = document.querySelector(`[data-whisper-key="${whisperKey}"].send-chat-btn`);

    // Event listener for sending a message
    sendButton.addEventListener('click', function() {
      const message = chatInput.value.trim();
      if (message) {
        // Store the message in the 'messages' node under the whisper key
        const messagesRef = database.ref(`whispers/${whisperKey}/messages`);
        const messageData = {
          sender: currentUser.email, // Assuming you have currentUser object or access to sender's email
          message: message,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        messagesRef.push(messageData);

        // Clear the chat input
        chatInput.value = '';
      }
    });

    // Event listener for closing the chat window
    const closeChatButton = chatBox.querySelector('.close-chat-btn');
    closeChatButton.addEventListener('click', function() {
      // Remove the chat box from the document body
      document.body.removeChild(chatBox);
    });

    // Event listener for displaying incoming messages
    const chatMessagesRef = database.ref(`whispers/${whisperKey}/messages`);
    chatMessagesRef.on('child_added', function(snapshot) {
      const messageData = snapshot.val();
      const chatMessages = document.getElementById(`chat-messages-${whisperKey}`);
      const messageElement = document.createElement('li');
      messageElement.textContent = `${messageData.sender}: ${messageData.message}`;
      chatMessages.appendChild(messageElement);
    });
  }
});






