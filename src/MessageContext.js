import React, { createContext, useState, useContext } from 'react';

export const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [deletedMessages, setDeletedMessages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0); // Track total messages

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTotalMessages((prevCount) => prevCount + 1); // Increment total messages
  };

  const deleteMessage = (messageId) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    setDeletedMessages((prevCount) => prevCount + 1);
  };

  return (
    <MessagesContext.Provider value={{ messages, deletedMessages, totalMessages,setTotalMessages, addMessage, deleteMessage }}>
      {children}
    </MessagesContext.Provider>
  );
};
