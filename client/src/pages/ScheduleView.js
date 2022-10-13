import React from "react";
import { useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import io from 'socket.io-client'; // Socket.io
const socket = io.connect('http://localhost:4000');



/**
 * This component renders the 'schedule view' which allows the user to preview meetings.
 * If the user created a given meeting, then they are given the option to edit the meeting.
 * Every user also has the option to create a new meeting.
 */
const ScheduleView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    console.log(state);
    const username = state.username;

    const [meetingList, setMeetingList] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState('Select a meeting');
    const [selectedDescription, setSelectedDescription] = useState('to see a description.');
    const [selectedTimestamp, setSelectedTimestamp] = useState('');
    const [selectedUsername, setSelectedUsername] = useState('');
    const [linkHelpText, setLinkHelpText] = useState('');

    
    // These methods refresh the page when a new meeting is created,
    // so that content appears dynamically. A more elegant implementation
    // can be written so that the page doesn't refresh,
    // but the author didn't have time to do that.
    socket.on('receive_meeting', (data) => {
        window.location.reload();
    });
    socket.on('edit_meeting', (data) => {
        window.location.reload();
    });
    socket.on('delete_meeting', (data) => {
        window.location.reload();
    });

    // This method fetches all scheduled meetings to be displayed on the sidebar.
    useEffect(() => {
        socket.emit('join_schedule');
        socket.emit('get_meetings');
        // Get list of meetings (fetched from the db in backend)
        socket.on('meetingList', (meetingList) => {
            console.log('Meetings:', JSON.parse(meetingList));
            meetingList = JSON.parse(meetingList);
            // Sort these meetings by __createdtime__
            meetingList = sortMeetingsByDate(meetingList);
            setMeetingList((state) => [...meetingList, ...state]);
        });

        return () => socket.off('meetingList');
    }, [socket]);

    
    function sortMeetingsByDate(meetingList)
    {
        return meetingList.sort(
            (a,b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    // This function handles highlighting the current meeting selected, and changing 
    // the state variables (which in turn will be rendered in the return function).
    // Essentially, this function allows the user to click on meetings and navigate
    // between them.
    function selectDiv(key)
    {
        const element = document.getElementById(key);
        console.log(element);
        element.style = 'border: black solid 2.5px';
        setSelectedTitle(meetingList[key].title);
        setSelectedDescription(meetingList[key].description);
        setSelectedUsername('Created by: ' + meetingList[key].username);
        setSelectedTimestamp('At: '+formatDate(meetingList[key].__createdtime__));
        setLinkHelpText('To join the meeting, click the link on the right.');
        for (var i = 0; i < meetingList.length; i++)
        {
            if (i != key)
            {
                const otherDiv = document.getElementById(i);
                otherDiv.style = 'border: black solid 1px';
            }
        }
    }

    // The next 3 functions create buttons which allow the user to edit, delete, and add new
    // meetings. 
    function returnEditButtons(meeting)
    {
        if (username === meeting.username)
        {
            return(
                <><button
                    onClick={(e)=> navigate(
                        '/edit',
                        {state: {editorType: 'meeting', action: 'edit', username: meeting.username, title: meeting.title, description: meeting.description}}
                    )}
                >Edit</button>
                <button
                    onClick={(e) => deleteMeeting(meeting)}
                    >Delete</button>
                </>
            );
        } else
        {
            return <></>;
        }
    }

    function createNew()
    {
        navigate('/edit', {state: {editorType: 'meeting', action: 'add', username: username}});
    }

    async function deleteMeeting(meeting)
    {
        socket.emit('meeting_deleted', {meetingTitle: meeting.title, meetingDescription: meeting.description, username: meeting.username, timestamp: meeting.timestamp});
        function timeout(delay) {
            return new Promise( res => setTimeout(res, delay) );
        }
        await timeout(1000);
        window.location.reload();
    }

    return (
        <div className='scheduleContainer'>
            <div className='headerBox'>
                <h1>Upcoming Meetings</h1>
            </div>
            <div className='middleContentBox'>
                <h3>{selectedTitle}</h3>
                <p>{selectedDescription}</p>
                <br/>
                <p>{selectedUsername}</p>
                <p>{selectedTimestamp}</p>
                <p><i>{linkHelpText}</i></p>
            </div>
            <div className="rightContentBox">
                <h1>Meetings</h1>
                {meetingList.map((mtg, i) => (

                    <div
                        className='meeting'
                        id={i}
                        key={i}
                        onClick={(e) => selectDiv(i)}
                    >

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                            <span className='metadata'>{mtg.username}</span>
                            <span className='metadata'>
                                {formatDate(mtg.__createdtime__)}
                            </span>
                        </div>
                        <Link to='/meeting' state={{ username: username, title: mtg.title, creator: mtg.username }}>{mtg.title}</Link>
                        <h3 className="title"></h3> 
                        <p className='description'>{mtg.description}</p>
                        <p>{returnEditButtons(meetingList[i])}</p>
                    </div>
                ))}
                <button
                    onClick={(e) => createNew()}
                >
                    Create meeting
                </button>
            </div>

        </div>
    );
};
export default ScheduleView;