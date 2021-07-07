var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UsersignUp = new Schema({

    first_name: {
        type : String,
        required: true,
        unique : true
    },
    last_name: {
        type : String,
    },
    email: {
        type : String,
        required: true,
    },
    password: {
        type : String,
        required: [true, 'Please fill out this filed']
    },
    messages: [{
        type: Schema.Types.ObjectId, 
        ref: 'message_users'
    }],
}, { collection: 'signup_users'});

module.exports = mongoose.model('signUp_data', UsersignUp);