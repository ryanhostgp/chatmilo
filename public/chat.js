const socket = io();
    let userName = localStorage.getItem('userName');

    // Display a message in the chat container
    function displayMessage(message) {
      const chatContainer = document.getElementById('chat-container');
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      chatContainer.appendChild(messageElement);
    }

    // Function to handle sending a message
    function sendMessage(event) {
      event.preventDefault();
      const messageInput = document.getElementById('message-input');
      const message = messageInput.value;

      // Validate the message
      if (message.trim() === '') {
        return; // If the message is blank, do not send it
      }

      // Send the message to the server
      socket.emit('message', message);

      // Clear the input field
      messageInput.value = '';
    }

    // Add an event listener to the message form
    const messageForm = document.getElementById('message-form');
    messageForm.addEventListener('submit', sendMessage);

    // Display a message when a user joins the chat
    socket.on('userJoin', (name) => {
      displayMessage(`${name} has joined the chat.`);
    });

    // Display a message when a user leaves the chat
    socket.on('userLeave', (name) => {
      displayMessage(`${name} has left the chat.`);
    });

    // Display a message when a user changes their username
    socket.on('userChange', (data) => {
      const { prevUserName, newUserName } = data;
      displayMessage(`${prevUserName} has changed their username to ${newUserName}.`);
    });

    // Display received messages
    socket.on('message', (data) => {
      const { user, message } = data;
      displayMessage(`${user}: ${message}`);
    });

    // Function to handle changing the user's name
    function changeName() {
      const newUserName = prompt('Enter your new name:');

      if (newUserName) {
        // Display a message in the chat container
        displayMessage(`${userName} has changed their username to ${newUserName}.`);

        // Update the user's name
        userName = newUserName;

        // Notify the server of the name change
        socket.emit('join', userName);
      }
    }

    // Add an event listener to the name changer button
    const nameChanger = document.getElementById('name-changer');
    nameChanger.addEventListener('click', changeName);

    // Prompt the user to set their name if not already stored
    if (!userName) {
      userName = prompt('Please enter your name:');
      localStorage.setItem('userName', userName);
    }

    socket.emit('join', userName);