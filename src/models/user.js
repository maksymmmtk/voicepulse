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

class User {

    // Отримання даних користувача за ID
    static getById(userId, callback) {
        connection.query(`SELECT * FROM users WHERE ID = ?`, [userId], function (error, results, fields) {
            if (error)
                callback(error, null);
            else
                callback(null, results);
        });
    }
    
    // Отримання даних користувача за електронною адресою
    static getByEmail(email, callback) {
        // SQL запит для перевірки існування користувача
        connection.query(`SELECT * FROM users WHERE email = ?`, [email], function (error, results, fields) {
            if (error)
                callback(error, null);
            else
                callback(null, results);
        });
    }

    // створення нового користувача
    static add(firstName, lastName, email, hash, callback) {
        connection.query(`INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?);`, [firstName, lastName, email, hash], function (error, results, fields) {
            if (error)
                callback(error, null);
            else
                callback(null, results);
        });
    }
}

module.exports = User;