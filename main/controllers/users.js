const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const usersMessage = require('../models/usersMessage');
const usersSignUp = require('../models/usersSignUp');
const coba_use = require('../../test/coba');

mongoose.set('useCreateIndex', true);
// Sign In GET
exports.signIn = async (req, res)=>{
  res.render('signIn', {title: 'Login Users'});
};

// Sign In POST
exports.signIn_post = async (req, res, next)=>{
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'signIn',
    failureFlash: true
  })(req, res, next);
};

// Sign Up GET
exports.signUp = async (req, res)=>{
  res.render('signUp', {title: 'Register Users'});
};

// Sign Up POST
exports.signUp_save = async (req, res, next) => {
  insertRecordsignUp(req, res);
}

// Alternative SignUp function POST
async function insertRecordsignUp (req, res) {
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
    await usersSignUp.findOne({ email: email }).then(user => {
      if (user) {
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
              .then(user => {
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

// Alternative Pesan Masuk Get From MongoDB
// Pesan Masuk Get Data From Database MongoDB
exports.pesanmasuk = async (req, res)=>{
  await usersMessage.find((err, docs) => {
    docs = docs.reverse();
    if(!err){
      res.render('pesanMasuk', {
        title: 'Pesan masuk', 
        msg: docs,
        user : req.user
      });
    }else{
      console.log('Error Get Data : ' + err);
    }
  })
};

// Dynamic Modal Body Form Get
exports.modalbody = async (req, res)=>{
  res.render('modalBody', {
    user : req.user
  });
};

// Tulis Pesan Get
exports.tulispesan = async (req, res)=>{
  res.render('tulisPesan', {title: 'Tulis Pesan'});
};

// Pesan Masuk POST
exports.pesanmasuk_save = async (req, res) => {
    insertRecordmessage(req, res);
}

// Alternative Pesan masuk Post
async function insertRecordmessage(req, res) {
  const {userId} = req.body;
  await usersSignUp.findOne({email: req.body.cc_message})
  .then(docs => {
    if(!docs){
        req.flash(
        'error_msg',
        'Unfortunately Your Message Cannot be Send Because Email Not Found'
        );
      res.redirect('/')
    }
      // Create a new message
      const newMessage = new usersMessage(req.body)
      // get userId
      const user = await usersSignUp.findById(userId)
      // assign a message as a from
      newMessage.from = user;
      // save a message
      await newMessage.save();
      // add Message to the user messages array
      user.messages.push(newMessage)
      // save the user
      await user.save();
      
      req.flash(
        'success_msg',
        'Message Send And Encrypted'
      );
      res.redirect('/')
  }) 
  .catch(err => {
    res.status(500).json({
      message: 'Message Sent Error',
      error: err
    })
  })
}

// Coba Post
exports.coba_post = async (req, res, next) => {
  const {userId} = req.body;
  // Create a new message
  const newMessage = new coba_use(req.body);
  console.log('messages', newMessage);
  // get user
  const user = await usersSignUp.findById(userId)
  // assign a message as a from
  newMessage.from = user;
  // save a message
  await newMessage.save();
  // add Message to the user messages array
  user.messages.push(newMessage)
  // save the user
  await user.save();

  res.status(201).json({newMessage})
}

// Coba
exports.coba_get = async (req, res) => {
  const message = await coba_use.find()
  res.render('coba', {
      messages: message
  });
}


// Pesan Masuk POST
// function insertRecordmessage(req, res) {
//   const {kepada_message, cc_message, subjek_message, text_message,from} = req.body;
//   var messageusers = new usersMessage({
//     kepada_message,
//     cc_message ,
//     subjek_message,
//     text_message,
//     from
//   });
//   usersSignUp.findOne({email: cc_message})
//   .then(users => {
//     if(!users){
//       req.flash(
//         'error_msg',
//         'Unfortunately Your Message Cannot be Send Because Email Not Found'
//       );
//       res.redirect('/')
//     }else{
//       req.flash(
//         'success_msg',
//         'Message Send And Encrypted'
//       );
//       messageusers.save()
//     }
//     res.redirect('/')
//     })
//   .catch(err => {
//     res.status(500).json({
// 			message : 'Error In Email',
// 			error: err
//     })
//   })
// }


// Pesan Terkirim Get
exports.pesanterkirim = async (req, res)=>{
  res.render('pesanTerkirim', {title: 'Pesan Terkirim'});
};


// Get Data By Id
exports.bacapesan_byId = async (req, res) => {
  usersMessage.findById(req.params.id, (err, doc) => {
    if(!err){
      res.render('bacaPesan', {
        title: 'Baca Pesan',
        msg: doc,
        user : req.user,
      });
    }
  });
}

// Logout
exports.logoutUsers = async (req, res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('signIn');
};
