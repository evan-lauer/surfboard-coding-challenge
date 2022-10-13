/**
 * This piece of code is borrowed from:
 * https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/#project-setup
 * who gracefully helped me figure out how to link this messaging app with HarperDB.
 */

var axios = require('axios');

function harperSaveMessage(message, username) {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;

    var data = JSON.stringify({
        operation: 'insert',
        schema: 'meeting_manager_chat',
        table: 'messages',
        records: [
            {
                message,
                username,
            },
        ],
    });

    var config = {
        method: 'post',
        url: dbUrl,
        headers: {
            'Content-Type': 'application/json',
            Authorization: dbPw,
        },
        data: data,
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(JSON.stringify(response.data));
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

module.exports = harperSaveMessage;