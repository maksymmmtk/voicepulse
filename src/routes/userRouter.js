const express = require('express');
const router = express.Router()

// Підключення контролерів
const userController = require('../controllers/userController');

// Маршрут для сторінки "Вхід", відправляє сторінку "Вхід"
router.get('/login', userController.getLogIn);

// Маршрут для аутентифікації користувача
router.post('/login/authentication', userController.authentication);

// Маршрут для обробки успішного входу в систему
router.post('/login/login-success', userController.logIn);

// Маршрут для сторінки "Реєстрація", відправляє сторінку "Реєстрація"
router.get('/signup', userController.getSignUp);

// Маршрут для перевірки унікальності електронної пошти
router.post('/signup/check-email', userController.checkEmail);

// Маршрут для обробки успішної реєстрації
router.post('/signup/signup-success', userController.signUp);

// Маршрут для перевірки статусу входу користувача
router.get('/api/check-login', userController.checkLogIn);

// Маршрут для виходу користувача з системи
router.get('/logout', userController.logOut);

module.exports = router;