import React, { useState } from 'react';

/**
 * This component creates the input field for the chat app, and emits the
 * 'message_send' socket message when a message is sent.
 */
const Input = ({ username, socket }) => {

    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message !== '') {
            const timestamp = Date.now();
            socket.emit('message_send', { username, message, timestamp });
            setMessage('');
        }
    };

    const keyPressHandler=(event)=>{
        if (event.key === "Enter")
        {
            sendMessage();
        }
    };
    
    return (
        <div className='inputContainer'>
            <input
                className='chatInput'
                placeholder='Type here to chat'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyDown={(e) => keyPressHandler(e)}
            />
            <button
                id='sendBtn'
                className='sendChat'
                onClick={sendMessage}
            >→</button>
        </div>
    );

    
}

export default Input;