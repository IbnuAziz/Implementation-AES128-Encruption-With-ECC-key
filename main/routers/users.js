var express = require('express');
var router = express.Router();

const usersController = require('../controllers/users');
const { ensureAuthenticated,forwardAuthenticated } = require('../../config/auth');

router.get('/coba',   usersController.coba_get);
router.post('/coba',  usersController.coba_post);
router.get('/signUp', forwardAuthenticated, usersController.signUp);
router.post('/signUp', usersController.signUp_save);
router.get('/signIn', forwardAuthenticated, usersController.signIn);
router.post('/signIn', usersController.signIn_post);
router.get('/modalBody', ensureAuthenticated, usersController.modalbody);
router.get('/pesanMasuk', ensureAuthenticated, usersController.pesanmasuk);
router.get('/pesanTerkirim', ensureAuthenticated, usersController.pesanterkirim);
router.get('/tulisPesan', ensureAuthenticated, usersController.tulispesan);
router.get('/bacaPesan/:id', ensureAuthenticated, usersController.bacapesan_byId);
router.get('/personalinfo?', ensureAuthenticated, usersController.personalInfo);
router.get('/confirm', (req, res) => {
    res.json('confrim');
});
router.post('/pesanMasuk', ensureAuthenticated, usersController.pesanmasuk_save);
router.get('/logout', usersController.logoutUsers);
router.get('/deletePesan/:id', ensureAuthenticated, usersController.message_delete);
router.get('/:id', ensureAuthenticated, usersController.editpersonalInfo);
router.post('/:id', ensureAuthenticated, usersController.editpersonalinfoSAVE);

module.exports = router;
