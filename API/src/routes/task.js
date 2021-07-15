const express = require('express');

const router = express.Router();
const taskController = require('../controllers/task');

router.post('/add', taskController.add);
router.post('/update', taskController.update);
router.get('/all', taskController.all);

module.exports = router;