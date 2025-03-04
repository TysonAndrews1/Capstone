import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import { getCurrentUser } from '../components/FetchData';

//ChatGPT used to help connecting to websocket and backend

export default function ChatPage() {
    const BASE_URL = "http://localhost:8080";

    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("User");

    // Fetch chat history once on component mount
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/chat/history`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Chat history fetched:", data);
                setMessages(data); // Populate messages with chat history
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };

        fetchChatHistory();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Set up WebSocket connection and subscribe to messages
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({ webSocketFactory: () => socket });

        // Fetch the current user
        getCurrentUser().then((user) => {
            setUsername(user.firstName);
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket");
            client.subscribe("/topic/public", (msg) => {
                try {
                    const parsedMessage = JSON.parse(msg.body);
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, parsedMessage];
                        return updatedMessages;
                    });
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Send a message on button click or Enter key press
    const sendMessage = () => {
        if (stompClient && message.trim()) {
            const chatMessage = {
                sender: username,
                content: message,
                type: "CHAT",
            };
            console.log(chatMessage);
            stompClient.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
            });
            console.log("Message sent:", message);
            setMessage("");
        }
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
