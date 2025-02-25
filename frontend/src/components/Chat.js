import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import apiService from "../services/apiService";

// Connect to Socket.io server
const socket = io("https://p2p-1.onrender.com");

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Get the logged-in user's name from localStorage
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
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h3>Users</h3>
                <ul style={styles.userList}>
                    {users.map((user, index) => (
                        <li key={index}
                            style={{
                                ...styles.user,
                                backgroundColor: user.name === selectedUser ? "#007bff" : "transparent",
                                color: user.name === selectedUser ? "white" : "black",
                            }}
                            onClick={() => setSelectedUser(user.name)}>
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={styles.chatArea}>
                <h2 style={styles.username}>
                    {selectedUser ? `Chat with ${selectedUser}` : "Select a user to chat"}
                </h2>
                <div style={styles.chatBox}>
                    {messages.map((msg, index) => (
                        <div key={index} style={styles.messageContainer}>
                            <p style={styles.message}>
                                <strong>{msg.sender}:</strong> {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={styles.input}
                    />
                    <button onClick={sendMessage} style={styles.button}>Send</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        width: "80%",
        margin: "auto",
        height: "500px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    sidebar: {
        width: "30%",
        padding: "20px",
        backgroundColor: "#f1f1f1",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
    },
    userList: {
        listStyleType: "none",
        padding: 0,
    },
    user: {
        padding: "10px",
        borderBottom: "1px solid #ccc",
        cursor: "pointer",
    },
    chatArea: {
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
    },
    username: {
        textAlign: "center",
        color: "#333",
    },
    chatBox: {
        flex: 1,
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#f9f9f9",
    },
    inputContainer: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    input: {
        flex: 1,
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "8px 12px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer",
    },
};

export default Chat;
