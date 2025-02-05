// Підключення модулів
const express = require('express');
const session = require('express-session');

// Роутери
const headerRouter = require('./src/routes/headerRouter');
const userRouter = require('./src/routes/userRouter');
const pollRouter = require('./src/routes/pollRouter');

// Контроллер для обробки помилок
const errorController = require('./src/controllers/errorController');

// Конфігурація
const config = require('./src/config/config');

// Ініціалізація express-додатку
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

// Налаштування сесії
app.use(session(config.session));

// Маршрути
app.use('/', headerRouter);
app.use('/', userRouter);
app.use('/', pollRouter);

// Обробник помилок
app.use(errorController.getError);

// Запуск сервера
app.listen(config.port, () => {
    console.log(`Server started: http://localhost:${config.port}`)
});