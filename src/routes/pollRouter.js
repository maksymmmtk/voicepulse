const express = require('express');
const router = express.Router()

// Підключення контролерів
const pollController = require('../controllers/pollController');

// API маршрут, який повертає дані про опитування
router.get('/api/services', pollController.getPollsData);

// Маршрут для відправлення сторінки "Опитування"
router.get('/services/poll', pollController.getPoll);

// Маршрут для отримання даних конкретного опитування
router.get('/api/poll', pollController.getPollData);

// Маршрут для додавання голосу користувача до опитування
router.post('/api/option', pollController.option);

module.exports = router;