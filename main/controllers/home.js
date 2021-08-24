const usersSignUp = require('../models/usersSignUp');
const usersMessage = require('../models/usersMessage');

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
    const response = await usersMessage.aggregate([
            { $match : {'cc_message' : {$eq: user}}},
            { $lookup: { from: "signup_users", localField: "dari", foreignField: "_id", as: "results"  } },
            {$unwind: "$results"},
        ]);
    return response;
}

exports.coba = async (req, res)=>{
    let inter = setInterval(() => {
        usersMessage.find()
    }, 1000);
    // let data = await getCoba().catch(error => {
    //     console.error(error)
    // })
    // console.log(data)
    
    console.log(inter)
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
