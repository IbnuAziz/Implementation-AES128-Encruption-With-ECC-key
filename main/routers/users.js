var express = require('express');
var router = express.Router();

const usersController = require('../controllers/users');
const { ensureAuthenticated,forwardAuthenticated } = require('../../config/auth');

router.get('/coba',   usersController.coba_get);
router.post('/coba/',  usersController.coba_post);
router.get('/signUp', usersController.signUp);
router.post('/signUp', usersController.signUp_save);
router.get('/signIn', usersController.signIn);
router.post('/signIn', usersController.signIn_post);
router.get('/modalBody', ensureAuthenticated, usersController.modalbody);
router.get('/pesanMasuk', ensureAuthenticated, usersController.pesanmasuk);
router.get('/pesanTerkirim', ensureAuthenticated, usersController.pesanterkirim);
router.get('/tulisPesan', ensureAuthenticated, usersController.tulispesan);
router.get('/bacaPesan/:id', forwardAuthenticated, usersController.bacapesan_byId);
router.get('/confirm', (req, res) => {
    res.json('confrim');
});
router.post('/pesanMasuk', ensureAuthenticated, usersController.pesanmasuk_save);
router.get('/logout', usersController.logoutUsers);

module.exports = router;
