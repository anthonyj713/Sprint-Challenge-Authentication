const router = require('express').Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js')

const { isValid } = require('../users/users-helper.js');

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;

  if(isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 12;

    const hash = bcryptjs.hashSync(credentials.password, rounds);
  
    credentials.password = hash;

    Users.add(credentials)
    .then(user => {
     res.status(201).json({
        data: user
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'There was an error registering the user'
      })
    })
  } else {
    res.status(400).json({
      message: 'Please provide a valid username and password'
    });
  };
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  if(isValid(req.body)){
    Users.findBy({ username: username })
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = createToken(user);
        res.status(200).json({
          message: 'Hello there!', token
        });
      } else {
        res.status(500).json({
          message: 'Invalid credentials'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'There was an error logging in'
      })
    })
  } else {
    res.status(400).json({
      message: 'Please provide a valid username and password'
    })
  }
});

function createToken(user) {
  const payload = {
    sub: user.id,
    username: user.username
  };

  const secret = process.env.JWT_SECRET || 'secret';

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
