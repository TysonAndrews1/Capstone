import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import {getCurrentUser} from '../components/FetchData'



export default function ChatPage(){


    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("User");
    

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws"); // Adjust the backend URL if needed
        const client = new Client({ webSocketFactory: () => socket });
        getCurrentUser().then((e)=>{setUsername(e.firstName);
        })
        
        client.onConnect = () => {
            console.log("Connected to WebSocket");
            client.subscribe("/topic/public", (msg) => {
                setMessages((prev) => [...prev, JSON.parse(msg.body)]);
            });
        };
        
        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };

    }, []);

    const sendMessage = () => {
        if (stompClient && message.trim()) {
            const chatMessage = {
                sender: username,
                content: message,
                type: "CHAT",
            };
            stompClient.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
            });
            setMessage("");
        }
    };

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
            <p
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
            >User: {username}</p>
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
