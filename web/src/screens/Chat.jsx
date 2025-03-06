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
    const [chat, setChat] = useState({chatId: 1})
    const [accounts, setAccounts]= useState([])
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [chats, setChats] =useState([])
    const [createChatName, setCreateChatName] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedNewMembers, setSelectedNewMembers] =useState([])
    const [MembersDiv,setMembersDiv] = useState(false)

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
    //List of Chats that user is part of
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
                console.log(chat);
                const response = await fetch(`${BASE_URL}/chat/messages/${chat.chatId}`);
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
    }, [chat,accounts]);

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
            client.subscribe(`/topic/chat/${chat.chatId}`, (msg) => {
                console.log("subbed");
                
                try {                    
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
    }, [chat,accounts,currentUser]);

    // Send a message on button click or Enter key press
     const sendMessage = () => {
        console.log(currentUser);
        
        if (stompClient && message.trim()) {

            const chatMessage = {
                senderId: currentUser.accountId,
                content: message
            }
            stompClient.publish({
                destination: `/app/chat/${chat.chatId}/send`,
                body: JSON.stringify(chatMessage)  // No need to include the body if you're using URL parameters
              });
            setMessage("");
            console.log(messages);
            
        }
    };

    const createChat = async () => {
            const employeeIds = [...selectedEmployees.map(emp => emp.value), currentUser.accountId];
            try {
                let response = await fetch(`${BASE_URL}/chat/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: createChatName, accountIds: employeeIds }),
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const staticname = createChatName
                let newChat = await response.json();
                console.log(newChat);
                newChat = {chatId: newChat.id, name: staticname};
                setChats((prevChats) => [...prevChats, newChat]); // Update UI
            } catch (err) {
                console.error("Error creating chat:", err);
            }
    };
        

    const deleteMessages = () => {
        fetch(`${BASE_URL}/chat/clear/${chat.chatId}`, { method: "DELETE" })
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


    const removeChat=(chatId) =>{
        fetch(`${BASE_URL}/chat/${chatId}/accounts/${currentUser.accountId}`, {method: "DELETE"}).then((response) => {
            if (response.ok) {
                console.log("Removed from Chat.");
                setChats(chats.filter(fchat => fchat.chatId != chatId ))


                    const chatMessage = {
                        senderId: 0,
                        content: `${currentUser.firstName} ${currentUser.lastName} has left this Chat`
                    }
                    stompClient.publish({
                        destination: `/app/chat/${chatId}/send`,
                        body: JSON.stringify(chatMessage)  // No need to include the body if you're using URL parameters
                      });
                    console.log(messages);

            } else {
                console.error("Failed to remove account from chat.");
            }
        })
        .catch((error) => console.error("Error deleting messages:", error));
    }
    const addAccountToChat =() =>{
        for (let index = 0; index < selectedNewMembers.length; index++) {
            const element = selectedNewMembers[index];
            if (chat.chatId === 1) {
                setError("Sorry but you cannot change the membership of the public channel")
                console.log(error);
                
            }else if (chat.participants.some(account => account.accountId === element.value)) {
                setError(prev => prev + `Sorry but ${element.label} is already in this chat`)
                console.log(error);    
            }else{
            fetch(`${BASE_URL}/chat/${chat.chatId}/accounts/${element.value}`, {method: "POST"}).then((response) => {
                if (response.ok) {
                    console.log("Added from Chat.")
    
    
                        const chatMessage = {
                            senderId: 0,
                            content: ` ${element.label} has been added this Chat`
                        }
                        stompClient.publish({
                            destination: `/app/chat/${chat.chatId}/send`,
                            body: JSON.stringify(chatMessage)  // No need to include the body if you're using URL parameters
                          });
                          setChat(prev => ({
                            ...prev,
                            participants: [...prev.participants, { accountId: element.value, firstName: element.label}]
                          }));
                          setError("")
                } else {
                    console.error("Failed to add account to chat.");
                }
            })}
        }

    }

    return (
        <div className="flex p-5 max-w-7xl mx-auto">
            {/* Sidebar for Creating Chat Spaces */}
            <div className="w-1/4 p-4 border-r border-gray-300">
                <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>
                <input 
                    placeholder="Chat Name" 
                    value={createChatName} 
                    onChange={(e) => setCreateChatName(e.target.value)} 
                    className="mt-4 p-2 w-full rounded mb-4 border"
                />
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
                    className="mt-4 p-2 w-full   rounded basic-button">
                    Create Chat
                </button>
    
                <h3 className="text-lg font-semibold mt-6">Your Chats</h3>
                <ul className="mt-2">
                    {chats.map((achat, index) => (
                        <li 
                            key={achat.chatId} 
                            className={`p-2 cursor-pointer flex justify-between items-center ${achat.chatId === chat.chatId ? 'bg-gray-300' : ''}`}
                            onClick={() => setChat(achat)}
                        >
                            <span>{achat.name} {achat.accounts}</span>
                            {index > 0 && ( // Show "X" button for all except the first chat
                                <button 
                                    className="ml-2 text-red-500 hover:text-red-700" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent onClick from selecting chat
                                        removeChat(achat.chatId)
                                    }}
                                >
                                    ✖
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
    
            {/* Chat Window */}
            <div className="w-2/4 p-4 text-center border-r border-gray-300">
                <h2 className="text-2xl font-semibold mb-4">WebSocket Chat</h2>
                <h4 className="font-semibold text-red-600" >{error}</h4>
                <p className="w-full p-2 mb-4">User: {currentUser.firstName}</p>
    
                {/* Messages Display */}
                <div className="border border-gray-300 p-3 h-72 overflow-y-auto mb-4 flex flex-col gap-2">
                    {messages.map((msg, index) => {
                        const isCurrentUser = msg.senderId === currentUser?.accountId || msg.id === currentUser?.accountId;
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
                {currentUser.role === "Manager" && (
                    <button onClick={deleteMessages} className="basic-button mt-4">Delete Messages</button>
                )}
            </div>
    
            {/* Add Members Panel */}
            <div className="w-1/4 p-4">

                <button   onClick={() => setMembersDiv(prev => !prev)}  className="text-lg font-semibold mb-4 basic-button">Add Members</button>
                {MembersDiv ?
                <div>
                <Select

                    isMulti
                    options={accounts}
                    value={selectedNewMembers}
                    onChange={setSelectedNewMembers}
                    placeholder="Select members to add"
                />
                <button 
                    onClick={addAccountToChat} 
                    className="mt-4 p-2 w-full bg-green-500 text-white rounded">
                    Add Members
                </button> </div>:
                    
                <></>}
                <div>
                    <p>Members: </p>

                    { chat.chatId == 1? <p>Everyone</p> :
                    chat.participants.map((name)=>(
                        <p key={name.chatId}>{name.firstName} {name.lastName}</p>
                    ))
                    }
                </div>
                
            </div>
        </div>
    );
    
}

