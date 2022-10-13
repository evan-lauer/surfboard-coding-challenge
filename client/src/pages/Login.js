import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'; // Page/URL Router
import { useNavigate } from 'react-router-dom';

//import './PageStyles.css';


import io from 'socket.io-client'; // Socket.io
const socket = io.connect('http://localhost:4000');

/**
 * This is the login page. It is built to accomodate password verification, but
 * the author did not have enough time to implement that behavior. However, socket.io
 * makes it very easy, so it'd be possible. Just haven't done it yet.
 */
const Login = () => {

    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const login = () => {
        if (username !== '')
        {
            // This socket event is not currently being used for anything--but
            // if password verification was added, this is the event you'd hook into.
            socket.emit('login', {username});
            navigate('/schedule', {state: {username: username}});
        }
    };

        
    const keyPressHandler = (event) => {
        if (event.key === "Enter") {
            login();
        }
    };

    return (
        <div className='loginContainer'>
            <div className='loginContent'>
                <div className='loginInfo'>
                    <h1><i>Meeting Manager</i></h1>
                    <p>To continue, enter your company credentials.</p>
                </div>
                <span>
                    <input
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    <input
                        type='password'
                        placeholder='Password'
                        onKeyDown={keyPressHandler}
                    />
                    <br />

                </span>
                <span>
                    <button
                        id='loginBtn'
                        onClick={login}
                    >→</button>
                </span>
            </div>
        </div>

    );

}

export default Login;