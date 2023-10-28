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
                .scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest"
                });

            // create db collection and send in the data
            database.ref("messages/" + timestamp).set({
                username,
                message,
              timestamp,

            });
        }

        function top() {
            document.getElementById('top').scrollIntoView();
        };

        function bottom() {
            document.getElementById('bottom').scrollIntoView();
            window.setTimeout(function() {
                top();
            }, 2000);
        };

        // display the messages
        const fetchChat = database.ref("messages/");

// check for new messages using the onChildAdded event listener
fetchChat.on("child_added", function(snapshot) {
  const messages = snapshot.val();
    const messageElement = document.createElement("li");

    // Set class based on sender (username)
    messageElement.className = username === messages.username ? "sent-message" : "received-message";
    
    // Create span elements for username, timestamp, and message
    const usernameSpan = document.createElement("span");
    usernameSpan.className = "username";  

    usernameSpan.textContent = `[${formatTimestamp(messages.timestamp)}] ${messages.username}: `;

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


//handle direct-messaging
document.addEventListener('DOMContentLoaded', function() {
    const directMessageForm = document.getElementById('direct-message-form');
    const recipientEmailInput = document.getElementById('recipient-email');
    const messageInput = document.getElementById('direct-message');
    const directMessageView = document.getElementById('direct-message-view');

    // Function to send direct messages to Firebase Realtime Database
    function sendDirectMessage(senderEmail, recipientEmail, message) {
        const timestamp = firebase.database.ServerValue.TIMESTAMP; // Server timestamp
        const messagesRef = firebase.database().ref('direct_messages');

        messagesRef.push({
            sender: senderEmail,
            recipient: recipientEmail,
            message: message,
            timestamp: timestamp
        });
    }

    // Event listener for direct message form submission
    directMessageForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const recipientEmail = recipientEmailInput.value.trim();
        const message = messageInput.value.trim();
        const senderEmail = firebase.auth().currentUser.email;

        if (recipientEmail && message) {
            // Send the direct message to the database
            sendDirectMessage(senderEmail, recipientEmail, message);

            // Clear input fields
            recipientEmailInput.value = '';
            messageInput.value = '';
        } else {
            // Handle invalid input (recipient email or message is empty)
            alert('Invalid recipient email or message.');
        }
    });

    // Event listener for displaying real-time direct messages
    firebase.database().ref('direct_messages').on('child_added', function(snapshot) {
        const message = snapshot.val();
        const currentUserEmail = firebase.auth().currentUser.email;

        // Check if the message is sent by the current user or is for the current user
        if (message.sender === currentUserEmail || message.recipient === currentUserEmail) {
            const messageElement = document.createElement('li');
            // Create a span element for the sender and recipient part
            const senderRecipientSpan = document.createElement('span');

            // Apply orange color if the message is sent by the current user, else use #097969 color
            senderRecipientSpan.style.color = message.sender === currentUserEmail ? 'orange' : '#097969';

            senderRecipientSpan.textContent = `[${message.sender}] to [${message.recipient}] - `;
            const timestampSpan = document.createElement('span');
            timestampSpan.textContent = `[${formatTimestamp(message.timestamp)}] :`;
            timestampSpan.style.color = 'blue';
          
            // Function to format timestamp into human-readable format
            function formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
            }

            // Create a span element for the message text
            const messageTextSpan = document.createElement('span');
            messageTextSpan.textContent = message.message;
            const newline = document.createElement('br');

            // Append spans to the message element
            messageElement.appendChild(senderRecipientSpan);
            messageElement.appendChild(timestampSpan);
            messageElement.appendChild(newline);
            messageElement.appendChild(messageTextSpan);

            // Append the message element to the direct message view
            document.getElementById('direct-message-view').appendChild(messageElement);

            // Scroll to the bottom of the direct message view
            directMessageView.scrollTop = directMessageView.scrollHeight;
        }
    });
});

// Get the input element and add an event listener for input events
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
    // Get the search query from the input field
    const query = searchInput.value.toLowerCase().trim();

    // Get the table rows
    const tableRows = document.querySelectorAll('.table tbody tr');

    // Loop through each row and hide/show based on the search query
    tableRows.forEach(row => {
        const courseName = row.querySelector('td:nth-child(2)').textContent.toLowerCase().trim();
        const section = row.querySelector('td:nth-child(3)').textContent.toLowerCase().trim();
        const faculty = row.querySelector('td:nth-child(4)').textContent.toLowerCase().trim();
        const time = row.querySelector('td:nth-child(5)').textContent.toLowerCase().trim();
        const room = row.querySelector('td:nth-child(6)').textContent.toLowerCase().trim();

        // Check if any of the row's data contains the search query
        if (courseName.includes(query) || section.includes(query) || faculty.includes(query) || time.includes(query) || room.includes(query)) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row
        }
    });
});
