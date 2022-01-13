const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');

router.get('/search', controller.getSearchResult);
router.get('/suggest', controller.getSuggestions);
router.get('/filterInfo', controller.getFilterInfo);
router.get('/:id', controller.getBookByID);

module.exports = router;
