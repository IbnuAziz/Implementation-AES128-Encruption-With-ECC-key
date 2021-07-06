var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Coba = new Schema({
    kepada : {type : String, required: true},
    cc :{type : String, required: true},
    subjek : {type : String, required: true},
    textarea : {type : String},
    createdAt : {type: Date, default:Date.now},
    updateAt : {type: Date, default:Date.now},
    from :{
        type: Schema.Types.ObjectId, 
        ref: 'signup_data'

    },
    isRead : {type:Boolean, default:false},
    // get: decrypt, set: encrypt
}, {collection: 'coba_message'});

module.exports = mongoose.model('coba', Coba);