const express = require('express');
const router = express.Router();
const { getGames, getGameById, getGameBySlug } = require('../controllers/gameController');

router.get('/', getGames);
router.get('/id/:id', getGameById);
router.get('/:slug', getGameBySlug);

module.exports = router;