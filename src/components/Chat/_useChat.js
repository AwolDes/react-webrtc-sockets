import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(
      "http://localhost:8080"
    );

    socketRef.current.on(
      "newChatMessage",
      ({ message }) => {
        console.log(message)
        setMessages(messages => [...messages, message]);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = ({ message }) => {
    socketRef.current.emit("newChatMessage", { message });
  };

  return { messages, sendMessage };
};

export default useChat;
