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
                console.log("Received message:", msg.body);
                try {
                    const parsedMessage = JSON.parse(msg.body);
                    console.log("Parsed message:", parsedMessage);
                    setMessages((prevMessages) => {
                        console.log("Previous messages:", prevMessages);
                        const updatedMessages = [...prevMessages, parsedMessage];
                        console.log("Updated messages:", updatedMessages);
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
        <div style={{ padding: 20, maxWidth: 500, margin: "auto", textAlign: "center" }}>
            <h2>WebSocket Chat</h2>
            <p style={{ width: "100%", padding: 8, marginBottom: 10 }}>User: {username}</p>
            <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto", marginBottom: 10 }}>
                {messages.map((msg, index) => (
                    <div key={index}><strong>{msg.sender}:</strong> {msg.content}</div>
                ))}
            </div>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type a message..." 
                style={{ width: "80%", padding: 8 }}
            />
            <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>Send</button>
        </div>
    );
};
