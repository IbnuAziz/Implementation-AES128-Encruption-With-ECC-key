var express = require('express');
var router = express.Router();

const homeController = require('../controllers/home');
const { ensureAuthenticated } = require('../../config/auth');

/* GET home page. */
router.get('/', ensureAuthenticated, homeController.home);
router.get('/coba', ensureAuthenticated, homeController.coba);
module.exports = router;
