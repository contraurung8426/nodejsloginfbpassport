const passportfb = require('passport-facebook').Strategy;

// Load User Model
const User = require('../models/User');

module.exports = function(passport){
  passport.use(
    new passportfb({
      clientID: "3642178692465486",
      clientSecret: "9753b0920031521b44963d8122a285cc",
      callbackURL: "https://passportloginfb.herokuapp.com/users/login_fb/cb",
      profileFields: ['email', 'gender', 'locale', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookID: profile._json.id, typelogin: 'facebook'})
        .then(user => {
          if (user) return done(null, user);
          const newUser = new User({
            facebookID: profile._json.id,
            name: profile._json.name,
            email: profile._json.email,
            typelogin: 'facebook'
          })
          newUser.save()
            .then(user => {
              return done(null, newUser);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
  );
}