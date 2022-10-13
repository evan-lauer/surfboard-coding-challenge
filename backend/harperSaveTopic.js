var axios = require('axios');

function harperSaveTopic(isDelete, isNewRecord, title, description, timeEst, parentMeeting, username)
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
            table: 'topics',
            records: [
                {
                    id: title + parentMeeting,
                    title,
                    description,
                    timeEst,
                    parentMeeting,
                    username,
                },
            ],
        });
    } else if (isDelete)
    {
        data = JSON.stringify({
            operation: 'delete',
            schema: 'meeting_manager_meetings',
            table: 'topics',
            hash_values: [title+parentMeeting],
        });
    } else
    {
        data = JSON.stringify({
            operation: 'update',
            schema: 'meeting_manager_meetings',
            table: 'topics',
            records: [
                {
                    id: title + parentMeeting,
                    title,
                    description,
                    timeEst,
                    parentMeeting,
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

module.exports = harperSaveTopic;