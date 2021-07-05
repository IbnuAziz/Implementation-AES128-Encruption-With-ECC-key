
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const usersSignUp = require('../main/models/usersSignUp');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      usersSignUp.findOne({
        email: email
      }).then(signup_users => {
        if (!signup_users) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, signup_users.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, signup_users);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(signup_users, done) {
    done(null, signup_users.id);
  });

  passport.deserializeUser(function(id, done) {
    usersSignUp.findById(id, function(err, signup_users) {
      done(err, signup_users);
    });
  });
};