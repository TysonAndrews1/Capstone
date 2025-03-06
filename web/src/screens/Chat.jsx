import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import { getCurrentUser,BASE_URL,getAccounts } from '../components/FetchData';
import Select from "react-select"
//ChatGPT used to help connecting to websocket and backend

export default function ChatPage() {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState("User");
    const [chatId, setChatId] = useState(1)
    const [accounts, setAccounts]= useState([])
    const [selectedEmployees, setSelectedEmployees] = useState([])
    useEffect(()=>{
        getCurrentUser().then((e)=>{setCurrentUser(e) 
        let uid = e.accountId
        
        getAccounts().then((data) => {
            const accounts = data
                .filter(account => account.accountId !== uid) // Exclude current user
                .map(account => ({
                    value: account.accountId,
                    label: `${account.firstName} ${account.lastName}`
                }));
            setAccounts(accounts)
        }).catch(error => {
            console.error("Error fetching accounts:", error);
        });
        
    })},[])
    // Fetch chat history once on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${BASE_URL}/chat/messages/${chatId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const chatData = await response.json();
                console.log(chatData);
                
                setMessages(chatData);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [chatId]);

    // Set up WebSocket connection and subscribe to messages
    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/api/chat`);
        const client = new Client({ webSocketFactory: () => socket });
        client.onConnect = () => {



            client.subscribe('/topic/echo', (msg) => {
                console.log("Echo response:", msg.body);
            });
            
            // Later when testing
            client.publish({
                destination: '/app/echo',
                body: 'Hello world'
            });

            console.log("Connected to WebSocket");
            client.subscribe(`/topic/chat/${chatId}`, (msg) => {
                console.log("subbed");
                
                try {
                    const parsedMessage = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, parsedMessage]);
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });
        };
        client.onStompError = (frame) => {
            console.error("STOMP error:", frame);
        };

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [chatId]);

    // Send a message on button click or Enter key press
     const sendMessage = () => {
        if (stompClient && message.trim()) {

            const chatMessage = {
                senderId: currentUser.accountId,
                content: message
            }
            stompClient.publish({
                destination: `/app/chat/${chatId}/send`,
                body: JSON.stringify(chatMessage)  // No need to include the body if you're using URL parameters
              });
            setMessage("");
        }
    };
    const deleteMessages = () => {
        fetch(`${BASE_URL}/chat/clear/${chatId}`, { method: "DELETE" })
            .then((response) => {
                if (response.ok) {
                    console.log("Chat messages deleted.");
                    setMessages([]);
                } else {
                    console.error("Failed to delete messages.");
                }
            })
            .catch((error) => console.error("Error deleting messages:", error));
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
    }, [sendMessage]);


    return (
        <div className="p-5 max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">WebSocket Chat</h2>
            <p className="w-full p-2 mb-4">User: {currentUser.firstName}</p>
            {/* Dropdown to select user for private chat */}
            <Select
                isMulti
                options = {accounts}
                value={selectedEmployees}
                onChange={setSelectedEmployees}
                placeholder="Select Coworkers"
                />

            


            <div className="border border-gray-300 p-3 h-72 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId}:</strong> {msg.content}
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
            <button onClick={deleteMessages} className="p-2 ml-2 border rounded">Delete</button>
        </div>
    );
}

