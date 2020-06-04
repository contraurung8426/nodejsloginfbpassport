const passportfb = require('passport-facebook').Strategy;

// Load User Model
const User = require('../models/User');

module.exports = function(passport){
  passport.use(
    new passportfb({
      clientID: "3642178692465486",
      clientSecret: "9753b0920031521b44963d8122a285cc",
      callbackURL: "https://passportloginfb.herokuapp.com/users/login_fb/cb"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=> {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}