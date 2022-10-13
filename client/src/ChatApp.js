import './index.css'; // Base styles

import React from 'react'; // React components
import { useState } from 'react';

import Join from './components/join/join.js'; // Join page component
import Chat from './components/chat/chat.js'; // Chat page component
import { useLocation } from "react-router-dom";

import io from 'socket.io-client'; // Socket.io
const socket = io.connect('http://localhost:4000');



/**
 * This component renders the live chat function. It is designed to be flexible,
 * so the chat app can be rendered in any page. This is why the chat app is not included
 * in the browser router--it's designed to be a smaller part of a larger page.
 */
const ChatApp = ({username}) => {

    const [menuDisplay, setMenuDisplay] = useState('inline-block'); // This will toggle to none when chat is joined
    const [chatDisplay, setChatDisplay] = useState('none'); // This will toggle to inline-block when chat is joined

    const joinRoom = () => {
        if (username !== ' ') {
            socket.emit('join_room', { username });
            setMenuDisplay('none');
            setChatDisplay('inline-block');
        }
    };

    return (
        <div className='ChatApp'>

            <Join
                username={username}
                display={menuDisplay}
                joinRoom={joinRoom}
            />
            <Chat
                username={username}
                socket={socket}
                display={chatDisplay}
            />
        </div>
    );

};

export default ChatApp;