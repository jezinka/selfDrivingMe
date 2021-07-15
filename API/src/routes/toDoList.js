const express = require('express');

const router = express.Router();
const toDoListController = require('../controllers/toDoList');

router.get('/today', toDoListController.today);

module.exports = router;