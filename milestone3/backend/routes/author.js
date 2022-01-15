const express = require('express');
const router = express.Router();
const controller = require('../controllers/author');

router.get('/search', controller.getSearchResult);
router.get('/suggest', controller.getSuggestions);
router.get('/:id', controller.getAuthorByID);

module.exports = router;