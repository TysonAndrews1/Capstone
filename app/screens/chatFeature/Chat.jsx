import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
export default function ChatPage() {
    const BASE_URL = "http://10.0.2.2:8080"; // Use this for Android Emulator

    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("User");

    const getCurrentUser = async () => {
      return new Promise((resolve, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const email = user.email;
            console.log(email);
    
            try {
              const response = await fetch(`${BASE_URL}/accounts/user?email=${email}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              console.log(data);
              
              resolve(data);
            } catch (err) {
              console.error('Error fetching Account:', err);
              reject(err);
            }
          } else {
            reject(new Error('No user is currently logged in'));
          }
        });
      });
    };
    // Fetch chat history once on mount
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/chat/history`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                Alert.alert("Error", "Failed to load chat history");
            }
        };

        fetchChatHistory();
    }, []);

    // Set up WebSocket connection
    useEffect(() => {
        const socket = new SockJS(`${BASE_URL}/ws`);
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
                    setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });
        };

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    // Send a message
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

            setMessage(""); // Clear input
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, padding: 20 }}>
            <ScrollView>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>WebSocket Chat</Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>User: {username}</Text>

            <ScrollView style={{ flex: 1, borderWidth: 1, padding: 10, marginBottom: 10 }}>
                {messages.map((msg, index) => (
                    <Text key={index} style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>{msg.sender}: </Text>
                        {msg.content}
                    </Text>
                ))}
            </ScrollView>

            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Button title="Send" onPress={sendMessage} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

