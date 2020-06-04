const passportfb = require('passport-facebook').Strategy;

// Load FbUser Model
const FbUser = require('../models/FbUser');

module.exports = function(passport){
  passport.use(
    new passportfb({
      clientID: "3642178692465486",
      clientSecret: "9753b0920031521b44963d8122a285cc",
      callbackURL: "https://passportloginfb.herokuapp.com/users/login_fb/cb",
      profileFields: ['email', 'gender', 'locale', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      FbUser.findOne({FacebookID: profile._json.id}, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        const newUser = new FbUser({
          FacebookID: profile._json.id,
          name: profile._json.name,
          email: profile._json.email,
          accessToken: accessToken
        });
        newUser.save((err) => {
          return done(null, newUser);
        })
      })
    }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=> {
    FbUser.findById(id, function(err, user) {
      done(err, user);
    });
  });
}