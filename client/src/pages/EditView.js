import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import io from 'socket.io-client'; // Socket.io
const socket = io.connect('http://localhost:4000');

/**
 * This component handles the "edit view", which is in charge of allowing
 * the user to edit meetings and topics, as well as pushing those changes
 * to the database.
 */
const EditView = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { state } = location;

    const editorType = state.editorType; // Expects 'topic' or 'meeting'
    const action = state.action; // Expects 'Add' or 'Edit'
    const username  = state.username;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [parentMeeting, setParentMeeting] = useState('');
    const [timeEst, setTimeEst] = useState(-1);
    const [displayTopicSpecific, setDisplayTopicSpecific] = useState('');
    const [disableEditInputs, setDisableEditInputs] = useState();

    /**
     * This method checks the input parameters (which are given as a state)
     * to determine how the component will render. If it's an 'edit' request, then 
     * the "title" field will not be available to edit, because the title is 
     * used for indexing the meeting/topic in the database. (In an ideal implementation, 
     * this limitation wouldn't exist).
     */
    useEffect(() => {

    
        if (action === 'edit')
        {
            setTitle(state.title);
            setDescription(state.description);
            setDisableEditInputs(true);
            if (editorType === 'topic') // These attributes are specific to the topic editor
            {
                setDisplayTopicSpecific('inline-block');
                setParentMeeting(state.parentMeeting);
                setTimeEst(state.timeEst);
            } else
            {
                setDisplayTopicSpecific('none');
            }
        } else
        {
            if (editorType === 'topic')
            {
                setParentMeeting(state.parentMeeting);
                setDisplayTopicSpecific('inline-block');
            } else
            {
                setDisplayTopicSpecific('none');
            }
        }
    },[]);

    /**
     * This function saves the new or edited topic or meeting to the database by emitting 
     * the corresponding socket event. These events are all handled in backend/index.js
     */
    async function handleSave()
    {
        const timestamp = Date.now();
        if (action === 'edit')
        {
            if (editorType === 'topic') // Edit existing topic
            {
                socket.emit('topic_edited', {topicTitle: title, topicDescription: description, topicTimeEst: timeEst, topicParentMeeting: parentMeeting, username, timestamp,});
            } else // Edit existing meeting
            {
                socket.emit('meeting_edited', {meetingTitle: title, meetingDescription: description, username, timestamp,});
            }
        } else
        {
            if (editorType === 'topic') // Save new topic
            {
                socket.emit('topic_created', {topicTitle: title, topicDescription: description, topicTimeEst: timeEst, topicParentMeeting: parentMeeting, username, timestamp,});
            } else // Save new meeting
            {
                socket.emit('meeting_created', {meetingTitle: title, meetingDescription: description, username, timestamp,});
            }
        }
        // This delay makes sure the database saves the changes before sending
        // the user back to the previous page
        function timeout(delay) {
            return new Promise( res => setTimeout(res, delay) );
        }
        await timeout(1000);
        navigate(-1);
    }

    return (
        <div className="editContainer">
            <div className="headerBox">
                <h1>Preview {editorType}:</h1>
            </div>
            <div className="editBox">
                <div>
                    Edit title: 
                    <input 
                        className="titleEdit" 
                        disabled={disableEditInputs}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    Edit description: 
                    <textarea 
                        className="descriptionEdit" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <br/>
                <div style={{display: displayTopicSpecific}}>
                    Edit time estimate (please enter a numeric value): 
                        <input 
                            className="timeEstEdit" 
                            value={timeEst}
                            onChange={(e) => setTimeEst(e.target.value)}
                        /> minutes
                </div>
                <button
                    className="saveBtn"
                    onClick={(e) => handleSave()}
                >Save
                </button>
            </div>
            <div className="middleContentBox">
                <h3>{title}</h3>
                <p>{description}</p>
                <br/>
                <p>Created by: {username}</p>
                <p style={{display: displayTopicSpecific}} className="topicSpecific">Estimated duration: {timeEst} min</p>
            </div>
        </div>
    );
};

export default EditView;