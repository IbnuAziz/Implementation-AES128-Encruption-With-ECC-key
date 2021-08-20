const usersSignUp = require('../models/usersSignUp');
const usersMessage = require('../models/usersMessage');
const Timer = require('setinterval');
const SetInterval = require('set-interval')

var user;
var id;
var waktu;
async function getData() {
    return {
        masuk: await usersMessage.find({'cc_message' : {$eq: user}}),
        terkirim: await usersMessage.find({'dari': {$eq: id}})
    }
}

async function getCoba() {
    var message = await usersMessage.find({'cc_message' : {$eq: user}})
    for(const msg of message){
        console.log(msg) 
    }
}
exports.coba = async (req, res)=>{
    // let data = await getCoba()
    setInterval(getCoba, 3000)
}

// Pesan Masuk Get Data From Database MongoDB
exports.home = async (req, res)=>{
    user = req.user.email;
    id = req.user._id
    let pesan = [];
    let pesanMasukdata =  await getData()
    // pesan.push(setInterval(getCoba, 3000))
    // console.log(pesan)
    res.render('home', {
        title: 'Enkripsi AES 128', 
        pesanMasuk: pesanMasukdata.masuk,
        pesanTerkirim: pesanMasukdata.terkirim,
        user: req.user
    });
};
