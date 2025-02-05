const express = require('express');
const router = express.Router();

// Підключення контролерів
const headerController = require('../controllers/headerController');

// Основний маршрут, відправляє головну сторінку
router.get('/', headerController.getHome);

// Маршрут, який відправляє сторінку "Про нас"
router.get('/about', headerController.getAbout);

// Маршрут, який відправляє сторінку "Послуги"
router.get('/services', headerController.getServices);

// Маршрут, який відправляє сторінку "Команда"
router.get('/team', headerController.getTeam);

// Маршрут, який відправляє сторінку "Зв'язатись"
router.get('/contact', headerController.getContact);

module.exports = router;