const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');

router.get('/', controller.test);

module.exports = router;
