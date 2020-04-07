import React from "react";

import useChat from "./_useChat";
import MessageBox from "./MessageBox";
import Messages from "./Messages";

const Chat = ({ roomId }) => {
  const { messages, sendMessage } = useChat(roomId);
  console.log(messages)
  return (
    <div>
      <Messages messages={messages} />
      <MessageBox
        onSendMessage={message => {
          sendMessage({ message, roomId });
        }}
      />
    </div>
  );
};

export default Chat;
