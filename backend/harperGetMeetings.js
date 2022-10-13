var axios = require('axios');

function harperGetMeetings(optionalSqlString)
{
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;

    var data = JSON.stringify({
        "operation": "sql",
        "sql": "SELECT * FROM meeting_manager_meetings.meetings" + optionalSqlString
    });

    var config = {
        method: 'post',
        url: dbUrl,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': dbPw
        },
        data: data
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

module.exports = harperGetMeetings;