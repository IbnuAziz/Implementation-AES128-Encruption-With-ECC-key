const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
const nodemailer = require('nodemailer');

const usersMessage = require('../models/usersMessage');
const usersSignUp = require('../models/usersSignUp');
const enc_dec = require('../../public/js/encANDdec');
const setinter = require('../../public/js/formfunc');
const isread = require('../../public/js/isread');

mongoose.set('useCreateIndex', true);
// Sign In GET
exports.signIn = async (req, res)=>{
  res.render('signIn', {title: 'Login Users'});
};

// Get Data dan use Globaly
var usermail;
var userid;
async function getData() {
    return {
        masuk: await usersMessage.find({'cc_message' : {$eq: usermail}}),
        terkirim: await usersMessage.find({'dari': {$eq: userid}})
    }
}

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

// pesan Masuk Function
async function incomingMessage() {
  let messages= [];
  const message = await usersMessage.aggregate([
            { $match : {'cc_message' : {$eq: usermail}}},
            { $lookup: { from: "signup_users", localField: "dari", foreignField: "_id", as: "results"  } },
            {$unwind: "$results"},
          ])
          message.forEach(docs => {
            messages.push(docs)
          })
          
  return [messages, ret];
  // console.log('hello')
} 

// API Pesan Masuk
exports.pesanmasuknotrender = async (req, res, next) => {
  usermail = req.user.email
  userid = req.user._id
  var resMessage = [];
  var name;

  await usersMessage.aggregate([
    { $match : {'cc_message' : {$eq: usermail}}},
    { $lookup: { from: "signup_users", localField: "dari", foreignField: "_id", as: "results"  } },
    // {
    //   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$results", 0 ] }, "$$ROOT" ] } }
    // },
    {$unwind: "$results"},
  ])
  .exec((err, result)=>{
    if(err){
      next(err)
    }

    result.forEach(element => {
      name = element.results
    });

    resMessage = result.reverse()
    res.json({
      total: result.length,
      totalNotFiltered: result.length,
      rows: resMessage
    })
  })
}

// Alternative Pesan Masuk Get From MongoDB
exports.pesanmasuk = async (req, res, next) => {
  usermail = req.user.email
  userid = req.user._id
  let docs = await getData();

  await usersMessage.aggregate([
    { $match : {'cc_message' : {$eq: usermail}}},
    { $lookup: { from: "signup_users", localField: "dari", foreignField: "_id", as: "results"  } },
    {$unwind: "$results"},
  ])
  .exec((err, result)=>{
    if(err){
      next(err)
    }

  res.render('pesanMasuk', {
      title: 'Pesan Masuk',
      helpers: enc_dec,
      pesanTerkirim: docs.terkirim,
      pesanMasuk: result.map(doc =>({
        id: doc._id,
        subjek_message: doc.subjek_message,
        text_message: doc.text_message,
        email: doc.email,
        first_name: doc.results.first_name,
        last_name: doc.results.last_name,
        createdAt: doc.createdAt,
        isRead: doc.isRead,
        image: doc.results.personalinfoImage
      }))
      .reverse(),
      user : req.user
    })
  })
}

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

      // let enkripsi = enc_dec.enc(newMessage.text_message)
      // var transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: 'enkripsiaes@gmail.com',
      //     pass: '@qw3rty123456'
      //   }
      // })

      // var mailOption = {
      //   to: newMessage.cc_message,
      //   from: '"Enkripsi AES 128" <enkripsiaes@gmail.com>',
      //   subject: newMessage.subjek_message,
      //   text: enkripsi
      // }

      // transporter.sendMail(mailOption, (err, info) => {
      //   if(err){
      //     console.log('Error Send Message', err)
      //   }else{
      //     console.log({info})
      //     req.flash(
      //       'success_msg',
      //       'Message Send And Encrypted'
      //     );
      //     return res.redirect('/')
      //   }
        
      // })
      res.redirect('/')
      // console.time('Pesan Masuk Time : ')
      // console.timeEnd('Pesan Masuk Time : ')
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

// Get Data By Id
exports.bacapesan_byId = async (req, res, next) => {
  const ID = req.params;
  userid = req.user._id;
  let itemMessage;
  let docs = await getData()
  let helper = enc_dec;

  await usersMessage.aggregate([
    { $match : {$or: [
      {'dari' : {$ne: userid}}, 
      {'dari' : {$eq: userid}}
    ]}},
    { $lookup: { from: "signup_users", localField: "dari", foreignField: "_id", as: "message"  } },
    {$unwind: "$message"}
  ])
  .exec((err, mess)=>{
    if(err){
      console.log(err)
    }

    mess.forEach(doc => {
     if(doc._id == ID.id){
      itemMessage = doc
    }
   })

    res.render('bacaPesan', {
      title: 'Baca Pesan',
      helper: helper,
      pesanTerkirim: docs.terkirim,
      data : itemMessage,
      user : req.user
    })
    // console.time('Baca Pesan Time : ', itemMessage)
    // console.timeEnd('Baca Pesan Time : ', itemMessage)
  })
}

// Pesan Terkirim Get
exports.pesanterkirim = async (req, res, next)=>{
  userid = req.user._id
  let docs = await getData()

  await usersMessage.aggregate([
    { $match : {'dari' : {$eq: userid}}},
    { $lookup : {
      from: "signup_users", 
      localField: "dari", 
      foreignField: "_id", 
      as: "sent"
      }
    },
    {$unwind: "$sent"}

  ])
  .exec((err, data)=>{
    if(err){
      next(err)
    }

    res.render('pesanTerkirim', {
      title: 'Pesan Terkirim',
      pesanTerkirim : data.map(doc=>({
        id: doc._id,
        cc: doc.cc_message,
        subjek_message: doc.subjek_message,
        text_message: doc.text_message,
        createdAt: doc.createdAt,
        isRead: doc.isRead
      })).reverse(),
      user : req.user
    })
  })
}

// Delete Message 
exports.message_delete = async (req, res, next) => {
  const id = req.params.id;
  await usersMessage.findByIdAndRemove(id, (err, result) => {
    if(err){
      res.redirect('../pesanMasuk', {
        error: err
      })
    }else{
      req.flash(
        'success_msg',
        'Message Deleted Successfully!',
        id
      );
      res.redirect('../pesanMasuk')
    }
  })
}

// Personal Info
exports.personalInfo = async (req, res) => {
  usermail = req.user.email;
  userid = req.user._id;
  let personalprofile;
  let docs = await getData();

  await usersSignUp.find()
  .select('first_name last_name email brithday gender phoneNumber profession personalinfoImage')
  .exec()
  .then(result=>{

    result.forEach(doc => {
      if(doc.email == usermail){
        personalprofile = doc
     }
    })

    res.render('personalinfo', {
      title : 'Setting Profile',
      data: personalprofile,
      pesanMasuk: docs.masuk,
      pesanTerkirim: docs.terkirim,
      user : req.user,
    });
  })
  .catch(err => {
    console.log('Personal profile : ',err)
  })
}

// Edit Personal Info
exports.editpersonalInfo = async(req, res, next)=>{
  usermail = req.user.email;
  userid = req.user._id;
  let docs = await getData();

  await usersSignUp.findOne({_id: req.user._id},(err, doc)=>{
    if(err){
      console.log('Edit Personal Info: ', err)
      res.redirect('/')
    }else{
      res.render('personal-info-edit',{
        title: 'Edit Personal Info',
        data: doc,
        pesanMasuk: docs.masuk,
        pesanTerkirim: docs.terkirim,
        user: req.user
      })
    }
  })
}

// Edit Personal Info Save
exports.editpersonalinfoSAVE = async (req, res, next)=>{
  let id = req.params.id;
  let new_image = '';
  const {first_name, last_name, brithday, gender, profession, email, phoneNumber } = req.body
  
   if(req.file){
    var records = {
      first_name,
      last_name,
      brithday,
      gender,
      profession,
      email,
      phoneNumber, 
      personalinfoImage: req.file.filename
    }
  }else{
    var records = {
      first_name,
      last_name,
      brithday,
      gender,
      profession,
      email,
      phoneNumber, 
    }
  }

  // if(req.file){
  //   new_image = req.file.filename;
  //   try {
  //     fs.unlinkSync('./uploads/'+req.body.old_image)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }else{
  //   new_image = req.body.old_image;
  // }
  await usersSignUp.findByIdAndUpdate(id, records, (err, docs)=>{
    if(err){
      console.log('something wrong in edit personal info save', err);
      next(err)
    }else{
      req.flash(
        'success_msg',
        'Data Successfully Edited!',
        id
      );
      res.redirect('/personalinfo')
    }
  })
}
// Logout
exports.logoutUsers = async (req, res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('signIn');
};
