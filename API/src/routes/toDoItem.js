const express = require('express');

const router = express.Router();
const toDoItemController = require('../controllers/toDoItem');

router.post('/schedule', toDoItemController.schedule);
router.post('/changeStatus', toDoItemController.changeStatus);

module.exports = router;