require('dotenv').config();

const express = require('express'); // Express framework
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); // socket.io

const harperSaveMessage = require('./harperSaveMessage.js');
const harperSaveMeeting = require('./harperSaveMeeting.js');
const harperSaveTopic = require('./harperSaveTopic.js');
const harperGetMeetings = require('./harperGetMeetings.js');
const harperGetTopics = require('./harperGetTopics.js');

app.use(cors()); // set up CORS

const server = http.createServer(app); // create server

const io = new Server(server, { // Allow CORS from 3000 for GET and POST methods
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const CHATBOT = 'MeetingBot';
const MEETING_ROOM = 'meeting_room';

let users = [];

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_schedule', (data) => {
        socket.join(MEETING_ROOM);
    });
    socket.on('join_meeting', (data) => {
        socket.join(MEETING_ROOM);
    });

    socket.on('login', (data) => {
        socket.join(MEETING_ROOM);
    });

    socket.on('join_room', (data) => {
        
        socket.join(MEETING_ROOM);
        // When user joins, client sends data
        // This happens at client/src/pages/join.js [line 7]
        const { username } = data;
        //socket.join(MEETING_ROOM);

        // Adds this user to the list of users
        users.push({ id: socket.id, username});

        // Allows the server to have the updated list of users
        socket.to(MEETING_ROOM).emit('chatroom_users', users);

        // Allows this user to see the list of users
        socket.emit('chatroom_users', users); 

        // Chat bot now sends a message announcing the new joiner
        let timestamp = Date.now();
        socket.to(MEETING_ROOM).emit('receive_message', {
            message: `${username} has joined the meeting`,
            username: CHATBOT,
            timestamp,
        });

        // Chat bot sends a message welcoming the user to the meeting
        socket.emit('receive_message', {
            message: `Welcome to the meeting, ${username}`,
            username: CHATBOT,
            timestamp,
        });
    });


    socket.on('message_send', (data) => {
        const {message, username, timestamp} = data;
        io.in(MEETING_ROOM).emit('receive_message', data);
        harperSaveMessage(message, username, timestamp)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err));
    });

    // Meeting operations (create, edit, delete)
    //
    socket.on('meeting_created', (data) => {
        const {meetingTitle, meetingDescription, username, timestamp} = data;
        io.in(MEETING_ROOM).emit('receive_meeting', data);
        harperSaveMeeting(false, true, meetingTitle, meetingDescription, username, timestamp)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err));
    });

    socket.on('meeting_edited', (data) => {
        const {meetingTitle, meetingDescription, username, timestamp} = data;
        io.in(MEETING_ROOM).emit('edit_meeting', data);
        harperSaveMeeting(false, false, meetingTitle, meetingDescription, username, timestamp)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err));
    });

    socket.on('meeting_deleted', (data) => {
        const {meetingTitle, meetingDescription, username, timestamp} = data;
        io.in(MEETING_ROOM).emit('delete_meeting', data);
        harperSaveMeeting(true, false, meetingTitle, meetingDescription, username, timestamp)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err));
    });

    // Topic operations (create, edit, delete)
    //
    socket.on('topic_created', (data) => {
        const {topicTitle, topicDescription, topicTimeEst, topicParentMeeting, username, timestamp} = data;
        io.in(MEETING_ROOM).emit('receive_topic', data);
        harperSaveTopic(false, true, topicTitle, topicDescription, topicTimeEst, topicParentMeeting, username, timestamp)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err));
    });

    socket.on('topic_edited', (data) => {
        const {topicTitle, topicDescription, topicTimeEst, topicParentMeeting, username, timestamp} = data;
        io.in(MEETING_ROOM).emit('edit_topic', data);
        harperSaveTopic(false, false, topicTitle, topicDescription, topicTimeEst, topicParentMeeting, username, timestamp)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err));
    });

    socket.on('topic_deleted', (data) => {
        const {topicTitle, topicDescription, topicTimeEst, topicParentMeeting, username, timestamp} = data;
        io.in(MEETING_ROOM).emit('delete_topic', data);
        harperSaveTopic(true, false, topicTitle, topicDescription, topicTimeEst, topicParentMeeting, username, timestamp)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err));
    });

    // Get a list of all meetings
    //
    socket.on('get_meetings', (data) => {
        const optionalSqlString = '';
        harperGetMeetings(optionalSqlString)
            .then((meetingList) => {
                console.log(meetingList);
                socket.emit('meetingList', meetingList);
            })
            .catch((err) => console.log(err));
    });

    // Get a specific meeting by title
    //
    socket.on('get_meeting', (data) => {
        const { optionalSqlString } = data;
        harperGetMeetings(optionalSqlString)
            .then((meeting) => {
                console.log(meeting);
                socket.emit('meeting', meeting);
            })
            .catch((err) => console.log(err));
    })

    // Get a list of topics for a given meeting
    socket.on('get_topics', (data) => {
        const { topicParentMeeting } = data;
        harperGetTopics(topicParentMeeting)
            .then((topicList) => {
                console.log(topicList);
                socket.emit('topicList', topicList);
            })
            .catch((err) => console.log(err));
    });

});

// Just making sure the server isn't broken
app.get('/', (req, res) => {
    res.send('Hello world');
});


server.listen(4000, () => 'Server is running on port 4000');

