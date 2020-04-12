import React, { useState } from 'react';


const MessageBox = ({ onSendMessage, setClientTyping }) => {
  const [message, setMessage] = useState('');
  return (
    <>
      <input
        value={message}
        onChange={e => {
          setMessage(e.target.value)
        }}
        onKeyDown={evt => {
          // maybe a bit much?
          setClientTyping(true)
          if (evt.key === "Enter") {
            evt.preventDefault();
            onSendMessage(message);
            setClientTyping(false)
            setMessage("");
          }
        }}
        />
      <button onClick={() => onSendMessage(message)}>Send</button>
    </>
  )
}

export default MessageBox;