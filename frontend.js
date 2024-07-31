// Select the DOM elements for the chatbot
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

// Initialize the user message and the initial height of the chat input
let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

// Function to create a chat list item (li) element
const createChatLi = (message, className) => {
    // Create a list item element
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    
    // Determine the content of the chat based on the class (outgoing or incoming)
    let chatContent = className === "outgoing" 
        ? `<p></p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    
    // Set the inner HTML of the list item
    chatLi.innerHTML = chatContent;
    
    // Set the message text inside the paragraph element
    chatLi.querySelector("p").textContent = message;
    
    return chatLi;
}

// Function to generate a response from the server
const generateResponse = (chatElement) => {
    // Get the paragraph element within the chat item
    const messageElement = chatElement.querySelector("p");

    // Make a POST request to the server
    fetch('http://127.0.0.1:5500/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userMessage
        })
    })
    .then(res => {
        // Check if the response is not OK and throw an error
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        // Log the server response
        console.log('Server response:', data);
        
        // If the response has a message, display it in the chat
        if (data && data.message) {
            console.log('Message to display:', data.message);
            messageElement.textContent = data.message.trim();
        } else {
            // Throw an error if the response message is undefined
            throw new Error('Response message is undefined');
        }
    })
    .catch(error => {
        // Log the error and display an error message in the chat
        console.error('Error:', error.message);
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    })
    .finally(() => {
        // Scroll the chatbox to the bottom
        chatbox.scrollTo(0, chatbox.scrollHeight);
    });
}

// Function to handle chat input
const handleChat = () => {
    // Get the user message and trim any extra whitespace
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear the chat input and reset its height
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Add the outgoing message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // After a short delay, add an incoming message placeholder and generate a response
    setTimeout(() => {
        const incomingChatLi = createChatLi("...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

// Adjust the height of the chat input as the user types
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle Enter key press to send the chat message
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Add event listeners for the send button, close button, and chatbot toggler
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
