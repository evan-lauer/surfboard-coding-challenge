import React, {useEffect, useState} from 'react';
import Chat from './chat';
import styles from './chatStyles.css';

/**
 * This component renders the messages to the user.
 */
const Messages = ({ socket }) => {
    const [messagesRecieved, setMessagesReceived] = useState([]);

    // This method renders new messages as they arrive
    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data);

            setMessagesReceived((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    timestamp: data.timestamp,
                },
            ]);
        });
        // Unmount
        return () => socket.off('receive_message');
    }, [socket]);

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    return (
        <div className='messagesColumn'>
            {messagesRecieved.map((msg, i) => (

                <div className='message' key={i}>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        <span className='metadata'>{msg.username}</span>
                        <span className='metadata'>
                            {formatDate(msg.timestamp)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                </div>
            ))}
        </div>
    );

};

export default Messages;