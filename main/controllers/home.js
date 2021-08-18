const usersSignUp = require('../models/usersSignUp');

// Pesan Masuk Get Data From Database MongoDB
exports.home = async (req, res)=>{
    res.render('home', {
        title: 'Enkripsi AES 128', 
        user: req.user 
    });
};
