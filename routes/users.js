const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('../dashboard');
  }
  res.render('login');
});

router.get('/dashboard', (req, res) => res.redirect('../dashboard'))

// Login Fb Page
router.get('/login_fb', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/login_fb/cb', (req, res, next) =>{
  passport.authenticate('facebook',{
    failureRedirect: 'login',
    successRedirect: 'dashboard'
  })(req, res, next);
});

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }

    // Check passwords match
    if (password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }

    if (errors.length > 0){
        res.render('register', {
            errors,
            email,
            password,
            name,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email})
          .then(user => {
            if (user){
              // User exists
              errors.push({ msg: 'Email is already registered' });
              res.render('register', {
                errors,
                name,
                email,
                password,
                password2
              });
            } else {
              const newUser = new User({
                name,
                email,
                password
              });

              // Hash password
              bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  // Set password to hashed
                  newUser.password = hash;
                  // Save user
                  newUser.save()
                    .then(user => {
                      req.flash('success_msg', 'You are now register and can login now')
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }))
            }
          });
    }
});


// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;