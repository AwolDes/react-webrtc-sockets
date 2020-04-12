import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../../styles/chat.css';

const Messages = ({ messages, clientId, partnerTyping }) => {
  return (
    <ScrollToBottom className='messages'>
      {messages.map(message => (<p className={`message ${clientId === message.sender ? 'my-message' : 'their-message'}`}>{message.text}</p>))}
      {partnerTyping && <p className="partnerTyping">Partner is typing</p>}
    </ScrollToBottom>
  )
}

export default Messages;