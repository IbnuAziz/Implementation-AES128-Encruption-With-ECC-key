var express = require('express');
var router = express.Router();

const usersController = require('../controllers/users');

router.get('/signUp', usersController.signUp);
router.get('/modalBody', usersController.modalbody);
router.get('/pesanMasuk', usersController.pesanmasuk);
router.get('/pesanTerkirim', usersController.pesanterkirim);
router.get('/tulisPesan', usersController.tulispesan);
router.get('/confirm', (req, res) => {
    res.json('confrim');
});
router.post('/signUp', usersController.signUp_save);
router.post('/PesanMasuk', usersController.pesanmasuk_save);
module.exports = router;
