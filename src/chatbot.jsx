import { Box, Button, Card, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput) return;

    const newMessages = [...messages, { sender: "User", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: userInput, // Using user input as the prompt
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract the response message from the new response structure
      const botMessage = response.data.candidates[0].content.parts[0].text;

      // Update messages with the bot response
      setMessages([...newMessages, { sender: "Chatbot", text: botMessage }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { sender: "Chatbot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Card sx={{ maxWidth: 600, width: "100%", p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Chatbot
        </Typography>
        <Box sx={{ maxHeight: 400, overflowY: "auto", mb: 2 }}>
          {messages.map((msg, i) => (
            <Typography key={i} variant="body1" sx={{ mb: 1 }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </Typography>
          ))}
        </Box>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading} // Disable input while loading
        />
        <Button
          onClick={handleSend}
          variant="contained"
          sx={{ mt: 1 }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </Card>
    </Box>
  );
}

export default Chatbot;
