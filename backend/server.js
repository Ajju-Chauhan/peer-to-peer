require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));
    

    

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const users = {}; // Store online users

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
        users[userId] = socket.id;
        io.emit("updateUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const receiverSocket = users[receiverId];
        if (receiverSocket) {
            io.to(receiverSocket).emit("receiveMessage", { senderId, message });
        }
    });

    socket.on("disconnect", () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                io.emit("updateUsers", users);
                break;
            }
        }
    });
});

server.listen(5000, () => console.log("Server running on port 5000"));
