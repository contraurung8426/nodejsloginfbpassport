const passportfb = require('passport-facebook').Strategy;

// Load User Model
const User = require('../models/User');

module.exports = function(passport){
  passport.use(
    new passportfb({
      clientID: "178464433586069",
      clientSecret: "062cd4c72ccbd545e59f106dd76741a9",
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