import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import { getCurrentUser,BASE_URL,getAccounts } from '../components/FetchData';

//ChatGPT used to help connecting to websocket and backend

export default function ChatPage() {

    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("User");
    const [selectedUser, setSelectedUser] = useState(""); // Store selected user for private chat
    const [usersList, setUsersList] = useState([""]); // Example users list

    // Fetch chat history once on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch chat history (public messages)
                const chatResponse = await fetch(`${BASE_URL}/chat/history`);
                if (!chatResponse.ok) {
                    throw new Error(`HTTP error! status: ${chatResponse.status}`);
                }
                const chatData = await chatResponse.json();
                console.log("Chat history fetched:", chatData);
                setMessages(chatData); // Populate messages with chat history

                // Fetch account data for users list
                const accountsResponse = await getAccounts();
                setUsersList(accountsResponse.map((e) => e.firstName));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Call the async function

    }, []); // This useEffect runs once on component mount

    useEffect(() => {
        // This effect runs when the selectedUser changes
        if (selectedUser) {
            const fetchPrivateMessages = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/chat/privateMessages/${username}/${selectedUser}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const privateMessages = await response.json();
                    console.log(`Private messages fetched for ${selectedUser}:`, privateMessages);
                    setMessages(privateMessages); // Update messages with private chat history
                } catch (error) {
                    console.error("Error fetching private messages:", error);
                }
            };

            fetchPrivateMessages(); // Fetch private messages when selectedUser changes
        }
    }, [selectedUser]); // Add selectedUser as a dependency

    const handleUserSelect = (event) => {
        setSelectedUser(event.target.value); // Update selected user when user selects a new one
    };


    // Set up WebSocket connection and subscribe to messages
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({ webSocketFactory: () => socket });
    
        getCurrentUser().then((user) => {
          setUsername(user.firstName);
        });

        client.onDisconnect = () => {
            console.log("WebSocket connection closed");
          }
    
        client.onConnect = () => {
          console.log("Connected to WebSocket");
    
          // Subscribe to public chat
          client.subscribe("/topic/public", (msg) => {
            console.log("Received public message:", msg.body);
            try {
              const parsedMessage = JSON.parse(msg.body);
              setMessages((prevMessages) => [...prevMessages, parsedMessage]);
            } catch (error) {
              console.error("Error parsing public message:", error);
            }
          });
    
          // If a user is selected for private chat, subscribe to their queue
          if (selectedUser) {
            console.log("WebSocket connection status:", client.connected);
            console.log("Subscribing to /queue/", selectedUser);


            
            client.subscribe(`/queue/${selectedUser}`, (msg) => {
              console.log("Received private message:", msg.body);
              try {
                const parsedMessage = JSON.parse(msg.body);
                setMessages((prevMessages) => [...prevMessages, parsedMessage]);
              } catch (error) {
                console.error("Error parsing private message:", error);
              }
            });
          }
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [selectedUser]); 

    // Send a message on button click or Enter key press
    const sendMessage = () => {
        let chatMessage;
      if (selectedUser) {
        if (stompClient && message.trim()) {
             chatMessage = {
                sender: username,
                recipient: selectedUser,
                content: message,
                type: "CHAT",
            }};
            console.log(chatMessage);
            
        stompClient.publish({
          destination: `/chat.sendPrivateMessage/${username}/${selectedUser}`,
          body: JSON.stringify(chatMessage),
        });
        console.log("ends");
        
      } else {
        if (stompClient && message.trim()) {
             chatMessage = {
                sender: username,
                content: message,
                type: "CHAT",
            };
        stompClient.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(chatMessage),
        });
      }}
            setMessage("");
        
    };

    // Handle Enter key press to send message
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Enter") {
                sendMessage(); // Call sendMessage when Enter is pressed
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [sendMessage]); // Ensure useEffect updates if sendMessage changes

    return (
        <div className="p-5 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">WebSocket Chat</h2>
        <p className="w-full p-2 mb-4">User: {username}</p>
         {/* Dropdown to select user for private chat */}
      <select
        onChange={handleUserSelect}
        value={selectedUser}
        style={{ marginBottom: "20px" }}
      >
        <option value="">Select User</option>
        {usersList.map((user, index) => (
          <option key={index} value={user}>
            {user}
          </option>
        ))}
      </select>
        <div className="border border-gray-300 p-3 h-72 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
                <div key={index}>
                    <strong>{msg.sender}:</strong> {msg.content}
                </div>
            ))}
        </div>
        <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message..." 
            className="w-4/5 p-2 rounded"
        />
        <button onClick={sendMessage} className="p-2 ml-2 border rounded">Send</button>
    </div>
    
    );
};
