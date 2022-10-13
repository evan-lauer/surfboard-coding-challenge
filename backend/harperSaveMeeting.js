var axios = require('axios');


function harperSaveMeeting(isDelete, isNewRecord, title, description, username)
{
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;

    var data;
    if (isNewRecord)
    {
        data = JSON.stringify({
            operation: 'insert',
            schema: 'meeting_manager_meetings',
            table: 'meetings',
            records: [
                {
                    id: title,
                    title,
                    description,
                    username,
                },
            ],
        });
    } else if (isDelete)
    {
        data = JSON.stringify({
            operation: 'delete',
            schema: 'meeting_manager_meetings',
            table: 'meetings',
            hash_values: [title],
        });
    } else
    {
        data = JSON.stringify({
            operation: 'update',
            schema: 'meeting_manager_meetings',
            table: 'meetings',
            records: [
                {
                    id: title,
                    title,
                    description,
                    username,
                },
            ],
        });
    }
    

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

module.exports = harperSaveMeeting;