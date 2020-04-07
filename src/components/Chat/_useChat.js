import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(
      process.env.REACT_APP_SIGNALING_SERVER
    );
    
    socketRef.current.emit('join', { roomId });
    socketRef.current.on(
      "newChatMessage",
      ({ message }) => {
        setMessages(messages => [...messages, message]);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = ({ message, roomId }) => {
    socketRef.current.emit("newChatMessage", { message, roomId });
  };

  return { messages, sendMessage };
};

export default useChat;