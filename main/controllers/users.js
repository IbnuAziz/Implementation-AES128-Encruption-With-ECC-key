const mongoose = require('mongoose');
const signUpUsers = require('../models/usersSignUp');
const usersMessage = require('../models/usersMessage');

mongoose.set('useCreateIndex', true);

exports.signUp = (req, res)=>{
  res.render('signUp', {title: 'Register Users'});
};

exports.signUp_save = (req, res, next) => {
  insertRecordsignUp(req, res);
}

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

exports.pesanmasuk = (req, res)=>{
  usersMessage.find((err, docs) => {
    if(!err){
      res.render('pesanMasuk', {
        title: 'Pesan masuk', pesan: docs
      });
    }else{
      console.log('Error Get Data : ' + err);
    }
  })
};

exports.tulispesan = (req, res)=>{
  res.render('tulisPesan', {title: 'Tulis Pesan'});
};

exports.tulispesan_save = (req, res) => {
  insertRecordmessage(req, res);
}

function insertRecordmessage(req, res) {
  var messageusers = new usersMessage();

  messageusers.kepada_message = req.body.kepada_message;
  messageusers.subjek_message = req.body.subjek_message;
  messageusers.text_message = req.body.text_message;
  
  messageusers.save((err, doc) => {
    if(!err){
      res.redirect('tulisPesan/confirm');  
    }else{
      console.log('error : ' +err);
    }
  })
}

exports.pesanterkirim = (req, res)=>{
  res.render('pesanTerkirim', {title: 'Pesan Terkirim'});
};

