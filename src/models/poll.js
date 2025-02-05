// Підключення mysql
const mysql = require('mysql2');

// Налаштування з'єднання з базою даних mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'f9n56Ski6zz64',
    database: 'voicepulse',
    multipleStatements: true
});

class Poll {
    
    // Отримання даних всіх опитувань
    static getPollsData(query, callback) {
        connection.query(query, [1, 2, 3], function (error, results, fields) {
            if (error)
                callback(error, null);
            else
                callback(null, results);
        });
    }

    // Отримання даних конкретного опитування
    static getPollData(query, pollId, callback) {
        connection.query(query, [pollId, pollId, pollId], function (error, results, fields) {
            if (error)
                callback(error, null);
            else
                callback(null, results);
        });
    }

     // Отримання конкретного учасника опитування
    static getPollParticipants(pollId, userId, callback) {
        connection.query(`SELECT * FROM poll_participants WHERE poll_id = ? AND user_id = ?;`, [pollId, userId], function (error, results, fields) {
            if (error)
                callback(error, null);
            else
                callback(null, results);
        });
    }

    // Додавання голосу користувача до опитування
    static option(userId, pollId, optionId, callback) {
        connection.query(`INSERT INTO poll_participants (user_id, poll_id, vote_option_id) VALUES (?, ?, ?);`, [userId, pollId, optionId], function (error, results, fields) {
            if (error)
                callback(error, null);
            else
                callback(null, results);
        });
    }
}

module.exports = Poll;