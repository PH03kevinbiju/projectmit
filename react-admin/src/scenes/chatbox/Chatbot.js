 import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const formatMessage = (text) => {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
  text = text.replace(/<li>/g, '<ul><li>').replace(/<\/li>(?![\n\r]*<li>)/g, '</li></ul>');
  text = text.replace(/\n/g, '<br>');
  return text;
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = 'AIzaSyC2YmKGXr4qx69qsQ-gWuAcfR4b0E47dkA'; // Replace with your actual API key
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setIsLoading(true);
    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: input }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setMessages([...newMessages, { text: aiResponse, user: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", user: false }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        Chatbot
        <button className="chatbot-close-btn" onClick={onClose}>✖</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`chatbot-message ${message.user ? 'user' : 'bot'}`}
            dangerouslySetInnerHTML={{ __html: message.user ? message.text : formatMessage(message.text) }}
          />
        ))}
        {isLoading && <div className="chatbot-message bot">Thinking...</div>}
      </div>
      <div className="chatbot-input-container">
        <input
          type="text"
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button className="chatbot-send-btn" onClick={sendMessage} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
