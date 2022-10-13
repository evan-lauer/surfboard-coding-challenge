# Meeting Manager App
This app is a collaborative workspace for organizations. Users can create meetings--within those meetings, they can create topics. Presenters (meeting owners) can add, edit, and delete topics, and other users see these updates in real time. There is also a real-time chat app for active communication during meetings.

Here's [a short video describing my design decisions.](https://www.youtube.com/watch?v=MPctFm4P-gQ&ab_channel=EvanLauer)

This application is built with React in the frontend, socket.io as middleware, and express.js, node.js, and HarperDB in the backend.

## How to run it

1. Clone this repository. Open a command prompt in ```surfboard-coding-challenge/client```. Enter the command ```npm install```. This will install front end dependencies. Next, run ```npm start``` to run the frontend app. (Leave this command prompt open).

2. Now open a new command prompt in ```surfboard-coding-challenge/backend```, and enter the command ```npm install``` to install backend dependencies. Next, run ```npm run dev``` to run the development server. 

(If the tab hasn't already opened, open ```localhost:3000``` in your browser. To verify that the server is running, open ```localhost:4000``` in another tab. ```localhost:4000``` should display "Hello world". If ```localhost:4000``` doesn't load, try the command ```rs``` in the backend command prompt to restart the server.)

3. Download the ```.env``` file (which I attached in my email for security reasons) and copy it into ```surfboard-coding-challenge/backend```.  

## Stack
|Frontend|Backend|
|--|--|
|[React](https://reactjs.org)|[node.js](https://nodejs.org)|
||[Express](https://expressjs.com)|
||[socket.io](https://socket.io)
||[HarperDB](https://harperdb.io)

## Acknowledgements
[This freecodecamp article](https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/) helped me get off the ground while working with socket.io and HarperDB. Certain code snippets are borrowed from this article. All of this code is open source.

Certain pieces of code are also borrowed from [the HarperDB code examples page](https://studio.harperdb.io/resources/examples/QuickStart%20Examples/Create%20dev%20Schema) which is also free and open source.

Googling how to do stuff is a very important part of my workflow.

## Future features
Here are a few features that I'd add right away (if this project was going into development):

#### UI/Design
- Chat app automatically fetches the last 10 messages and displays them upon login
- Chat app automatically scrolls to the bottom on new messages

#### Backend
- Password verification (this is very doable with socket.io but I haven't done it yet!)
- Utilizing socket.io rooms to have different interfaces for different organizations
- Utilizing socket.io rooms to have different live chats / direct messaging.

