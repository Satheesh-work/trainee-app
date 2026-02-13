const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

// Route to get todos (uses Redis caching + API service)
router.get('/todos', demoController.getTodos);

module.exports = router;
