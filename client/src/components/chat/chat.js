import './chatStyles.css';
import Messages from './messages.js';
import Input from './input.js';

/**
 * This is a container component, which renders the messages and input components.
 */
const Chat = ({username, socket, display}) => {
    return(
        <div style={{ display: display }} className="chatContainer">
            <div>
                <Messages socket={socket}/>
            </div>
            <div>
                <Input
                    username={username}
                    socket={socket}
                />
            </div>
        </div>
    );
}

export default Chat;