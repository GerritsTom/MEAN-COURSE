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
            message: 'Invalid authentication credentials!'
          });
        });
    });
})

router.post('/login', (req, res, next) => {
  // define a global user...
  let fetchedUser;
  // returns an array with a user object in it.
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed, User not found!'
        });
      }

      // we did found a user here...
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
      // here the result of the compare function
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed, Password wrong'
        });
      }
      // Authentication successfull => valid user with valid password here
      // get a token and ....
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      );
        // return it
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid Authentiaction credentials!'
      });
    })
})


module.exports = router;
