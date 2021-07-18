const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const usersMessage = require('../models/usersMessage');
const usersSignUp = require('../models/usersSignUp');
const enc_dec = require('../../public/js/encANDdec')

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
        const signupusers = new usersSignUp({
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
exports.pesanmasuk = async (req, res, next) => {
  await usersMessage.aggregate([
    { $match : {'dari' : {$ne: req.user._id}}},
    { $lookup: { from: "signup_users", localField: "dari", foreignField: "_id", as: "results"  } },
    {$unset:["kepada_message", "dari", "cc_message"]},
    {
      $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$results", 0 ] }, "$$ROOT" ] } }
    },
    // { $project: { results: {$split: ["$text_message",":"]}} },
    {$unwind: "$results"},
  ])
  .exec((err, result)=>{
    if(err){
      next(err)
    }
    
    res.render('pesanMasuk', {
      title: 'Pesan Masuk',
      helpers: enc_dec,
      data : result.map(doc =>({
          id: doc._id,
          subjek_message: doc.subjek_message,
          text_message: doc.text_message,
          email: doc.email,
          first_name: doc.first_name,
          last_name: doc.last_name,
          createdAt: doc.createdAt,
          isRead: doc.isRead
        
      })),
      user : req.user
    })
  })
}
// Pesan Masuk Get Data From Database MongoDB
// exports.pesanmasuk = async (req, res)=>{
//   await usersMessage.find((err, docs) => {
//     docs = docs.reverse();
//     if(!err){
//       res.render('pesanMasuk', {
//         title: 'Pesan masuk', 
//         msg: docs,
//         user : req.user
//       });
//     }else{
//       console.log('Error Get Data : ' + err);
//     }
//   })
// };

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

// Alternative Pesan Masuk Post


//Pesan masuk Post
async function insertRecordmessage(req, res) {
  await usersSignUp.findOne({email: req.body.cc_message}, 
    async function(err, docs){
      if(!docs){
        req.flash(
          'error_msg',
          'Unfortunately Your Message Cannot be Send Because Email Not Found'
        );
        return res.redirect('/')
      }else{
        // Create a new message
      const newMessage = new usersMessage(req.body)
      // get userId
      const user = await usersSignUp.findById(req.user._id)
      // assign a message as a dari
      newMessage.dari = user;
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
      console.time('Pesan Masuk Time : ')
      console.timeEnd('Pesan Masuk Time : ')
      res.redirect('/')
      }
    if(err) throw err
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

// Pesan Terkirim Get
exports.pesanterkirim = async (req, res)=>{
  res.render('pesanTerkirim', {
    title: 'Pesan Terkirim',
    user : req.user
  });
};

// Get Data By Id
exports.bacapesan_byId = async (req, res, next) => {
  const ID = req.params;
  await usersMessage.aggregate([
    { $match : {'dari' : {$ne: req.user._id}}},
    { $lookup: { from: "signup_users", localField: "dari", foreignField: "_id", as: "message"  } },
/*     {
      $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$message", 0 ] }, "$$ROOT" ] } }
    }, */
    {$unset:["kepada_message", "dari", "cc_message", "message.password", "message.messages", "message._id"]},
    {$unwind: "$message"}
  ])
  .exec((err, mess)=>{
    if(err){
      console.log(err)
    }

    let itemMessage
    mess.forEach(doc => {
     if(doc._id == ID.id){
      itemMessage = doc
    }
   })
    
    res.render('bacaPesan', {
      title: 'Baca Pesan',
      helper: enc_dec,
      data : itemMessage,
      user : req.user
    })
    // console.time('Baca Pesan Time : ', itemMessage)
    // console.timeEnd('Baca Pesan Time : ', itemMessage)
  })
}

// Logout
exports.logoutUsers = async (req, res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('signIn');
};
