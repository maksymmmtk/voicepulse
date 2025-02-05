const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const config = {
  // Налаштування сервера
  port: 3000,

  // Налаштування сесії
  session: {
    key: 'session_cookie_name',
    secret: 'session_secret',
    store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'f9n56Ski6zz64',
      database: 'voicepulse'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 день
    }
  }
};

module.exports = config;
