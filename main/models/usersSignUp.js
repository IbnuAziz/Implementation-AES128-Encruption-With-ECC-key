var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UsersignUp = new Schema({

    first_name: {
        type : String,
        required: true,
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
        required: [true, 'Please fill out this filed'],
        unique: true
    },
    brithday:{
        type: String,
        default: 'not set',
    },
    gender:{
        type: String,
        default: 'not set',
    },
    phoneNumber:{
        type: String,
        default: '086543219021',
    },
    profession:{
        type: String,
        default: 'not set'
    },
    messages: [{
        type: Schema.Types.ObjectId, 
        ref: 'message_users'
    }],
}, { collection: 'signup_users'});

module.exports = mongoose.model('signUp_data', UsersignUp);