const express = require('express');
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
})

router.post('/login', (req, res, next) => {
  // define a global user...
  let fetchedUser;
  // returns an array with a user object in it.
  User.find({email: req.body.email})
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed, User not found!'
        });
      }

      fetchedUser = user[0];
      return bcrypt.compare(req.body.password, user[0].password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed, Password wrong'
        });
      }
      // Authentication successfull
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
        );

        // return the token
        res.status(200).json({
          token: token,
          expriresIn: 3600
        });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed!'
      });
    })
})


module.exports = router;
