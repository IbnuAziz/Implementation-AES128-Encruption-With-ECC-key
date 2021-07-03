const mongoose = require('mongoose');
const signUpUsers = require('../models/usersSignUp');
const usersMessage = require('../models/usersMessage');

mongoose.set('useCreateIndex', true);
// Sign Up Get
exports.signUp = (req, res)=>{
  res.render('signUp', {title: 'Register Users'});
};
// Home two Get
// exports.homeTwo = (req, res)=>{
//   res.render('home_two', {title: 'Home Two'});
// };
// Sign Up POST
exports.signUp_save = (req, res, next) => {
  insertRecordsignUp(req, res);
}

// Sign Up Funcrtion POST
function insertRecordsignUp(req, res) {
  var signupusers = new signUpUsers();

  signupusers.first_name = req.body.first_name;
  signupusers.last_name = req.body.last_name;
  signupusers.email = req.body.email;
  signupusers.password = req.body.password;

  signupusers.save((err, doc) => {
    if(!err){
      res.redirect('signUp/confirm');  
    }else{
      console.log('error : ' +err);
    }
  })
}
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
exports.bacapesan = (req, res)=>{
  res.render('bacaPesan', {title: ' Baca Pesan'});
};

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
