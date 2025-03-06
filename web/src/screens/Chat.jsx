"use client"

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
    const [chats, setChats] =useState([])
    const [createChatName, setCreateChatName] = useState("")
    const [isLoading, setIsLoading] = useState(true)

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
    useEffect(() => {
        if (currentUser && currentUser.accountId) {
            getChats();
        }
    }, [currentUser]);
    const getChats = async () => {
        try {
            // Get the list of all chats
            const response = await fetch(`${BASE_URL}/chat/get`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const chats = await response.json();
            console.log("Initial chats data:", chats);
    
            // Since our new endpoint returns ChatDTO with participants included,
            // we don't need to make separate requests for each chat
            const chatsWithParticipants = await Promise.all(chats.map(async (chat) => {
                // Using the new endpoint that returns chat with participants
                const detailResponse = await fetch(`${BASE_URL}/chat/${chat.id}/with-participants`);
                if (!detailResponse.ok) {
                    throw new Error(`HTTP error! status: ${detailResponse.status}`);
                }
                const chatWithParticipants = await detailResponse.json();
                return chatWithParticipants;
            }));
            
            console.log("Chats with participants:", chatsWithParticipants);
    

    // Filter chats: include chats where user is a participant OR chat ID is 1 (public chat)
    console.log(currentUser);
    
    const filteredChats = chatsWithParticipants.filter(chat => 
        chat.chatId === 1 || // Always include public chat with ID:1
        chat.participants.some(participant => participant.chatId === currentUser.accountId)
    );
    
            
            console.log("Filtered chats for current user:", filteredChats);
            setChats(filteredChats);
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally{
            setIsLoading(false)
        }
    };
    // Fetch chat history once on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${BASE_URL}/chat/messages/${chatId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const chatData = await response.json();
                const newDataArray = chatData.map(chatData => {

                    if (chatData.senderId === currentUser.accountId) {
                        return {
                            id: chatData.senderId,
                            name: `${currentUser.firstName} ${currentUser.lastName}`,
                            content: chatData.content
                        };
                    }

                    const senderAccount = accounts.find(account => account.value === chatData.senderId);
                    const senderName = senderAccount ? `${senderAccount.label}` : 'Unknown';
                
                    return {
                        id: chatData.senderId,
                        name: senderName,
                        content: chatData.content
                    };
                });
                
                console.log(newDataArray);
                

                setMessages(newDataArray);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [chatId,accounts]);

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
                    let tempYou;


                
                    const parsedMessage = JSON.parse(msg.body)
                    console.log(parsedMessage);
                    console.log(accounts)
                    if (parsedMessage.senderId === currentUser.accountId) {
                        parsedMessage.name = `${currentUser.firstName} ${currentUser.lastName}`;
                    } else {
                        const senderAccount = accounts.find(account => account.value == parsedMessage.senderId);
                        console.log(accounts);
                        
                        parsedMessage.name = senderAccount
                            ? `${senderAccount.label}`
                            : 'Unknown';
                    }
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
    }, [chatId,accounts,currentUser]);

    // Send a message on button click or Enter key press
     const sendMessage = () => {
        console.log(currentUser);
        
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
            console.log(messages);
            
        }
    };

        const createChat = async () => {
            let employeeIds = [...selectedEmployees.map(emp => emp.value), currentUser.accountId];
            try {
                const response = await fetch(`${BASE_URL}/chat/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: createChatName, accountIds: employeeIds }),
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const newChat = await response.json();
                setChats((prevChats) => [...prevChats, newChat]); // Update UI
            } catch (err) {
                console.error("Error creating chat:", err);
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
        <div className="flex p-5 max-w-5xl mx-auto">
    {/* Sidebar for Creating Chat Spaces */}
    <div className="w-1/3 p-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>
        <input placeholder="Chat Name" value={createChatName} onChange={(e) => setCreateChatName(e.target.value)} />
        {/* Dropdown to select coworkers */}
        <Select
            isMulti
            options={accounts}
            value={selectedEmployees}
            onChange={setSelectedEmployees}
            placeholder="Select Coworkers"
        />

        <button 
            onClick={createChat} 
            className="mt-4 p-2 w-full bg-blue-500 text-white rounded">
            Create Chat
        </button>

        <h3 className="text-lg font-semibold mt-6">Your Chats</h3>
        <ul className="mt-2">
            {chats.map((chat) => (
                <li 
                    key={chat.chatId} 
                    className={`p-2 cursor-pointer ${chat.chatId === chatId ? 'bg-gray-300' : ''}`}
                    onClick={() => setChatId(chat.chatId)}
                >
                    {chat.name}{chat.accounts}
                </li>
            ))}
        </ul>
    </div>

    {/* Chat Window */}
    <div className="w-2/3 p-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">WebSocket Chat</h2>
        <p className="w-full p-2 mb-4">User: {currentUser.firstName}</p>

        {/* Messages Display */}
        <div className="border border-gray-300 p-3 h-72 overflow-y-auto mb-4 flex flex-col gap-2">
    {messages.map((msg, index) => {
        const isCurrentUser = msg.senderId === currentUser?.accountId ||msg.id === currentUser?.accountId;
        return (
            <div 
                key={index} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
                <div 
                    className={`p-2 w-[15vw] rounded-lg shadow-md ${
                        isCurrentUser 
                            ? 'bg-blue-500 text-white rounded-br-none' // Current user
                            : 'bg-gray-200 text-black rounded-bl-none' // Other users
                    }`}
                >
                    <span className="text-sm font-semibold block mb-1">{msg.name}</span>
                    <span className="text-sm">{msg.content}</span>
                </div>
            </div>
        );
    })}
</div>

        {/* Message Input */}
        <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message..." 
            className="w-4/5 p-2 rounded border"
        />
        <button onClick={sendMessage} className="p-2 ml-2 border rounded">Send</button>
        <button onClick={deleteMessages} className="p-2 ml-2 border rounded">Delete</button>
    </div>
</div>

    );
}

