var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UsersignUp = new Schema({
    first_name: {
        type : String,
        required: [true, 'Please fill out this filed']
    },
    last_name: {
        type : String,
    },
    email: {
        type : String,
        required: [true, 'Please fill out this filed']
    },
    password: {
        type : String,
        required: [true, 'Please fill out this filed']
    }
});

UsersignUp.pre("save", function (next){
    var user = this;

    if(this.isModified("password") || this.isNew){
        bcrypt.genSalt(10, function (saltError, salt){
            if(saltError){
                return next(saltError);
            }else{
                bcrypt.hash(user.password, salt, function(hashError, hash){
                    if(hashError){
                        return next(hashError);
                    }

                    user.password = hash;
                    next();
                });
            }
        });
    }else{
        return next();
    }
});


module.exports = mongoose.model('signUp_data', UsersignUp);