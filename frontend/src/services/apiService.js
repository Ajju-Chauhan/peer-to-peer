import axios from "axios";

const API_BASE_URL = "https://p2p-1.onrender.com/api";

const apiService = {
    // Login: expects an object with email and password
    login: async (userdata) => {
        return axios.post(`${API_BASE_URL}/auth/login`, userdata);
    },
    // Signup: accepts name, email, phone, password as separate arguments
    signup: async (name, email, phone, password) => {
        return axios.post(`${API_BASE_URL}/auth/signup`, { name, email, phone, password });
    },
    // Fetch users
    fetchUsers: async () => {
        return axios.get(`${API_BASE_URL}/auth/users`);
    },
    // Fetch messages between two users
    fetchMessages: async (user1, user2) => {
        return axios.get(`${API_BASE_URL}/chat/${encodeURIComponent(user1)}/${encodeURIComponent(user2)}`);
    },
    // Send a message
    sendMessage: async (sender, receiver, message) => {
        return axios.post(`${API_BASE_URL}/chat/send`, { sender, receiver, message });
    },
};

export default apiService;
