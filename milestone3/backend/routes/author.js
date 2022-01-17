const express = require('express');
const router = express.Router();
const controller = require('../controllers/author');

router.get('/search', controller.getSearchResult);
router.get('/:id', controller.getAuthorByID);
router.get('/:name/books', controller.getAuthorBooks);

module.exports = router;