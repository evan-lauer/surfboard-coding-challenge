import styling from './joinStyles.css';

/**
 * This method provides an interface for the user to join the chat room.
 */
const Join = ({username, display, joinRoom }) => {

    return (
        <div style={{ display: display }} className='chatContainer'>
            <div className='formContainer'>
                <h1>{`Meeting Chat`}</h1>
                <p>Welcome, <i>{username}</i>!</p>
                <button
                    id='joinBtn'
                    className='btn btn-secondary'
                    onClick={joinRoom}
                >Join Chat</button>
            </div>
        </div>
    );


};

export default Join;

