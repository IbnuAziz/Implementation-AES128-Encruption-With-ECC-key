var express = require('express');
var router = express.Router();
const multer = require('multer');

// Image Upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    //reject a file
    if(
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg'
        )
    {     
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
}).single('personalinfoImage')

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
router.post('/:id', upload, ensureAuthenticated, usersController.editpersonalinfoSAVE);

module.exports = router;
