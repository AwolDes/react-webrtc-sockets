import React from 'react';
import MessageBox from './messageBox';
import Messages from './messages';

const Chat = ({ messages, sendMessage, roomId, clientId, partnerTyping, setClientTyping }) => {
  return (
    <>
      <Messages messages={messages} clientId={clientId} partnerTyping={partnerTyping}/>
      <MessageBox
        onSendMessage={message => {
          sendMessage({ message, roomId });
        }}
        setClientTyping={setClientTyping}
        />
    </>
  )
}

export default Chat;