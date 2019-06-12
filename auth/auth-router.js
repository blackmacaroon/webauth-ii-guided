const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username; //save this logged in user in the cookie
        res.status(200).json({
          message: `Welcome ${user.username}! Here, have a cookie!`,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
  if(req.session) { //if we don't, there's no point in trying to log out. the session's already over
    req.session.destroy(err => {
      if(err) {
        res.json({ message: 'you can check out any time you like, but you can never leave'})
      } else {
        //res.status(204).end() //204 no content + end session OR
        res.status(200).json({ message: 'so long, and thanks for all the fish!'})
      }
    })
  } else {
    res.status(200).json({ message: "there hasn't been a user here for 45 years.."})
  }
});

module.exports = router;
