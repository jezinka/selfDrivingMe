const express = require('express');

const router = express.Router();
const toDoListController = require('../controllers/toDoList');

router.get('/today', toDoListController.today);
router.get('/week', toDoListController.week);

module.exports = router;