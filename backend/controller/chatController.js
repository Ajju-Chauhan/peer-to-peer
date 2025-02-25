const Message = require("../models/Message.js");

// 📌 Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id; // From JWT token

    const message = await Message.create({ senderId, receiverId, content });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

// 📌 Get messages between two users
const getMessages = async (req, res) => {
  try {
    const userId1 = req.user.id; // Logged-in user
    const userId2 = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

module.exports = { sendMessage, getMessages };
