const jwt = require('jsonwebtoken');

// exports a function...
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // pattern "Bearer token"
    jwt.verify(token, 'secret_this_should_be_longer');
    next();
  } catch(error) {
    res.status(401).json({message: 'You are not authenticated!'});
  }
};
