const express = require("express");
const Message = require("../models/Message"); // Import the Message model
const router = express.Router();

// Send a message
router.post("/send", async (req, res) => {
    const { sender, receiver, message } = req.body;
    console.log( sender, receiver, message)

    console.log("Received message:", req.body); // Debugging

    try {
        // Validate input
        if (!sender || !receiver || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create and save message
        const newMessage = new Message({ sender, receiver, message, timestamp: Date.now() });
        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully!" });
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch messages between two users
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  console.log(user1, user2)
  console.log("Received request with params:", req.params);

  if (!user1 || user1 === "undefined" || !user2) {
      return res.status(400).json({ error: "Both user1 and user2 are required" });
  }

  try {
      const messages = await Message.find({
          $or: [
              { sender: user1, receiver: user2 },
              { sender: user2, receiver: user1 },
          ],
      }).sort({ timestamp: 1 });

      res.json(messages);
  } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
