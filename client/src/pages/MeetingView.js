import React from "react";

import ChatApp from '../ChatApp.js';


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import io from 'socket.io-client'; // Socket.io
const socket = io.connect('http://localhost:4000');

/**
 * This component handles rendering the "meeting view". The meeting view
 * is designed to allow the user to preview each topic relating to the given meeting.
 * Additionally, if the current user is the same as the user who created the meeting, 
 * this view will link to the edit page--allowing the user to delete, edit, and add new topics
 * to the given meeting.
 * 
 * This page also refreshes when new topics are added to the selected meeting. This is not ideal,
 * because refreshing the page can disrupt the workflow. Again, socket.io is ideal for this,
 * and with a bit more work we could make the page update real-time without forcing a reload.
 */
const MeetingView = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    console.log(state);
    const username = state.username;
    const meetingTitle = state.title;
    const creator = state.creator;
    
    const [topicList, setTopicList] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState('Select a topic');
    const [selectedDescription, setSelectedDescription] = useState('to see a description.');
    const [selectedTimeEst, setSelectedTimeEst] = useState('');
    const [selectedUsername, setSelectedUsername] = useState('');

    // These methods handle real-time page refresh when a new topic is added relating
    // to the current meeting.
    socket.on('receive_topic', (data) => {
        if (data.topicParentMeeting === meetingTitle)
        {
            window.location.reload();
        }
    });
    socket.on('edit_topic', (data) => {
        if (data.topicParentMeeting === meetingTitle)
        {
            window.location.reload();
        }
    });

    socket.on('delete_topic', (data) => {
        if (data.topicParentMeeting === meetingTitle)
        {
            window.location.reload();
        }
    });


    // This method fetches the topics relating to the current meeting
    useEffect(() => {
        socket.emit('join_meeting');
        socket.emit('get_topics', { topicParentMeeting: meetingTitle });
        // Get list of meetings (fetched from the db in backend)
        socket.on('topicList', (topicList) => {
            console.log('Topics:', JSON.parse(topicList));
            topicList = JSON.parse(topicList);
            // Sort these meetings by __createdtime__
            topicList = sortTopicsByDate(topicList);
            setTopicList((state) => [...topicList, ...state]);
        });

        return () => socket.off('topicList');
    }, [socket]);

    
    function sortTopicsByDate(topicList)
    {
        return topicList.sort(
            (a,b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    // This function handles highlighting the current topic selected, and changing 
    // the state variables (which in turn will be rendered in the return function).
    // Essentially, this function allows the user to click on topics and navigate
    // between them.
    function selectDiv(key)
    {
        const element = document.getElementById(key);
        console.log(element);
        element.style = 'border: black solid 2.5px';
        setSelectedTitle(topicList[key].title);
        setSelectedDescription(topicList[key].description);
        setSelectedUsername('Created by: ' + topicList[key].username);
        setSelectedTimeEst('Estimated time: '+ topicList[key].timeEst + " min");
        for (var i = 0; i < topicList.length; i++)
        {
            if (i !== key)
            {
                const otherDiv = document.getElementById(i);
                otherDiv.style = 'border: black solid 1px';
            }
        }
    }

    // The next three functions all provide buttons for deleting, editing, and adding new
    // topics (assuming the user is the same one who created the meeting).
    async function deleteTopic(topic)
    {
        socket.emit('topic_deleted', {topicTitle: topic.title, topicDescription: topic.description, topicTimeEst: topic.timeEst, topicParentMeeting: topic.parentMeeting, username: topic.username, timestamp: topic.timestamp});
        function timeout(delay) {
            return new Promise( res => setTimeout(res, delay) );
        }
        await timeout(1000);
        window.location.reload();
    }

    function returnEditButtons(topic)
    {
        if (username === topic.username)
        {
            return(
                <><button
                    onClick={(e)=> navigate(
                        '/edit',
                        {state: {editorType: 'topic', action: 'edit', username: topic.username, title: topic.title, description: topic.description, timeEst: topic.timeEst, parentMeeting: topic.parentMeeting}}
                    )}
                >Edit</button>
                <button
                    onClick={(e) => deleteTopic(topic)}
                    >Delete</button>
                </>
            );
        } else
        {
            return <></>;
        }
    }

    function returnCreateNewButton()
    {

        if (username === creator)
        {
            return (<button
                onClick={(e) => navigate('/edit', {state: {editorType: 'topic', action: 'add', username: username, parentMeeting: meetingTitle}})}
                >Create new topic</button>);
        } else
        {
            return <></>;
        }
        
    }


    return(
        <div className="meetingViewContainer">
            <div className='headerBox'>
                <h1>{meetingTitle}</h1>
            </div>
            <div className='middleContentBox'>
                <h3>{selectedTitle}</h3>
                <p>{selectedDescription}</p>
                <br/>
                <p>{selectedUsername}</p>
                <p>{selectedTimeEst}</p>
            </div>
            <div className="rightContentBox">
            <h1>Topics</h1>
                {topicList.map((topic, i) => (

                    <div
                        className='meeting'
                        id={i}
                        key={i}
                        onClick={(e) => selectDiv(i)}
                    >

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                            <span className='metadata'>{topic.username}</span>
                            <span className='metadata'>
                                {topic.timeEst} min
                            </span>
                        </div>
                        
                        <h3 className="title">{topic.title}</h3> 
                        <p className='description'>{topic.description}</p>
                        <p>{returnEditButtons(topicList[i])}</p>
                    </div>
                ))}
                {returnCreateNewButton()}
            </div>
            <ChatApp username= {username}/>
        </div>
    );
};

export default MeetingView;