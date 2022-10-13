import React from 'react'; // React components
import ReactDOM from 'react-dom/client';

import './pages/PageStyles.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Page/URL Router

import Login from './pages/Login.js';
import ChatApp from './ChatApp.js';
import ScheduleView from './pages/ScheduleView.js';
import MeetingView from './pages/MeetingView.js';
import EditView from './pages/EditView.js';



const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * This method renders the BrowserRouter component, which will handle URL routing for the 
 * site. See the file paths of the above imports to see how each component is built.
 */
root.render(
    <Router>
        <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/schedule' element={<ScheduleView />}/>
            <Route path='/meeting' element={<MeetingView />}/>
            <Route path='/edit' element={<EditView />}/>
            <Route path='/meetingchat' element={<ChatApp />}/>
        </Routes>
    </Router>
);


