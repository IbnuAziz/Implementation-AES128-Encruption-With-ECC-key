const usersSignUp = require('../models/usersSignUp');

// Pesan Masuk Get Data From Database MongoDB
exports.home = (req, res)=>{
	usersSignUp.find((err, docs) => {
	  if(!err){
		res.render('home', {
		  title: 'Enkripsi AES 128', 
		  user: docs,
		});
	  }else{
		console.log('Error Get Data : ' + err);
	  }
	})
  };
