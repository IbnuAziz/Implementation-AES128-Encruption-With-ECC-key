const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const passport = require('passport');

const signUpUsers = require('../models/usersSignUp');
const usersMessage = require('../models/usersMessage');
const usersSignUp = require('../models/usersSignUp');

mongoose.set('useCreateIndex', true);
// Sign In GET
exports.signIn = (req, res)=>{
  res.render('signIn', {title: 'Login Users'});
};

// Sign In POST
exports.signIn_post = (req, res, next)=>{
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'signIn',
    failureFlash: true
  })(req, res, next);
};

// Sign Up GET
exports.signUp = (req, res)=>{
  res.render('signUp', {title: 'Register Users'});
};

// Sign Up POST
exports.signUp_save = (req, res, next) => {
  insertRecordsignUp(req, res);
}

// Alternative SignUp function POST
function insertRecordsignUp (req, res) {
  const { first_name, last_name, email, password } = req.body;
  
  let errors = [];
  
  if (!first_name || !last_name || !email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }
  

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('signUp', {
      title: 'Register Users',
      errors,
      first_name,
      last_name,
      email,
      password
    });
  }else {
    usersSignUp.findOne({ email: email }).then(signup_users => {
      if (signup_users) {
        errors.push({ msg: 'Email already exists' });
        res.render('signUp', {
          title: 'Register Users',
          errors,
          first_name,
          last_name,
          email,
          password
        });
      }else {
        const signupusers = new signUpUsers({
          first_name,
          last_name,
          email,
          password
        });
          bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(signupusers.password, salt, (err, hash) => {
            if (err) throw err;
            signupusers.password = hash;
            signupusers
              .save()
              .then(signup_users => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('signIn');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
}
// Sign Up Funcrtion POST
// function insertRecordsignUp(req, res) {
//   var signupusers = new signUpUsers();

//   signupusers.first_name = req.body.first_name;
//   signupusers.last_name = req.body.last_name;
//   signupusers.email = req.body.email;
//   signupusers.password = req.body.password;

//   signupusers.save((err, doc) => {
//     if(!err){
//       res.redirect('signUp/confirm');  
//     }else{
//       console.log('error : ' +err);
//     }
//   })
// }

// Pesan Masuk Get Data From Database MongoDB
exports.pesanmasuk = (req, res)=>{
  usersMessage.find((err, docs) => {
    docs = docs.reverse();
    if(!err){
      res.render('pesanMasuk', {
        title: 'Pesan masuk', 
        msg: docs,
      });
    }else{
      console.log('Error Get Data : ' + err);
    }
  })
};
// Dynamic Modal Body Form Get
exports.modalbody = (req, res)=>{
  res.render('modalBody');
};
// Tulis Pesan Get
exports.tulispesan = (req, res)=>{
  res.render('tulisPesan', {title: 'Tulis Pesan'});
};
// Pesan Masuk POST
exports.pesanmasuk_save = (req, res) => {
    insertRecordmessage(req, res);
}

// Function Pesan Masuk POST
function insertRecordmessage(req, res) {
  var messageusers = new usersMessage();

  messageusers.kepada_message = req.body.kepada_message;
  messageusers.cc_message = req.body.cc_message;
  messageusers.subjek_message = req.body.subjek_message;
  messageusers.text_message = req.body.text_message;
  
  messageusers.save((err, doc) => {
    if(!err){
      res.redirect('/');  
    }else{
      console.log('error : ' +err);
    }
  })
}

// function updateRecord(req, res) {
//   usersMessage.findOneAndUpdate({_id: usersMessage._id}, req.body, {new: true}, (err, doc) => {
//     if(!err){
//       res.redirect('bacaPesan/:id');
//     }else{
//       console.log('Error Find And update'+ err);
//     }
//   });
// }
// Pesan Terkirim Get
exports.pesanterkirim = (req, res)=>{
  res.render('pesanTerkirim', {title: 'Pesan Terkirim'});
};
// Baca Pesan GET
// exports.bacapesan = (req, res)=>{
//   res.render('bacaPesan', {title: ' Baca Pesan'});
// };

// Get Data By Id
exports.bacapesan_byId = (req, res) => {
  usersMessage.findById(req.params.id, (err, doc) => {
    if(!err){
      res.render('bacaPesan', {
        title: 'Baca Pesan',
        msg: doc
      });
    }
    // if(!err){
    //   res.status(200).json({
    //     msg: doc,
    //     request: {
    //       type: 'GET',
    //       url: 'http://localhost:300/bacaPesan'
    //     }
    //   });
    // }else{
    //   res.status(404).json({
    //     message: 'No valid entry found for provided ID'
    //   });
    // }
  });
}

// Logout
exports.logoutUsers = (req, res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('signIn');
};
