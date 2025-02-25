import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import apiService from "../services/apiService";
import "./Chat.css"; // Import the responsive CSS

// Connect to Socket.io server (using your production URL)
const socket = io("https://p2p-1.onrender.com");

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Get the logged-in user's identifier from localStorage
    // (You might want to store username instead of userId; adjust as needed)
    const username = localStorage.getItem("userId") || "Anonymous";

    useEffect(() => {
        if (username) {
            socket.emit("register", username);
        }

        const fetchInitialData = async () => {
            try {
                const usersResponse = await apiService.fetchUsers();
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchInitialData();

        const handleReceiveMessage = (data) => {
            // Only add messages that involve the logged-in user and the selected user
            if (data.sender === selectedUser || data.sender === username) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [selectedUser, username]);

    useEffect(() => {
        if (username && selectedUser) {
            apiService.fetchMessages(username, selectedUser)
                .then((response) => setMessages(response.data))
                .catch((error) => console.error("Error fetching messages:", error));
        }
    }, [username, selectedUser]);

    const sendMessage = async () => {
        if (!message.trim() || !selectedUser) return;
        try {
            await apiService.sendMessage(username, selectedUser, message);
            socket.emit("send_message", { sender: username, receiver: selectedUser, message });
            setMessages((prev) => [...prev, { sender: username, message }]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h3>Users</h3>
                <ul className="user-list">
                    {users.map((user, index) => (
                        <li
                            key={index}
                            className={`user-item ${user.name === selectedUser ? "selected" : ""}`}
                            onClick={() => setSelectedUser(user.name)}
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-area">
                <h2 className="chat-header">
                    {selectedUser ? `Chat with ${selectedUser}` : "Select a user to chat"}
                </h2>
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className="message-container">
                            <p className="message">
                                <strong>{msg.sender}:</strong> {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                    />
                    <button onClick={sendMessage} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
