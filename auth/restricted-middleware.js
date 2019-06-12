
module.exports = (req, res, next) => {

  if (req.session && req.session.username) { //if we have a session, and if the session has a user property (that we set in auth-router login)
    next();
  } else {
    res.status(400).json({ message: 'must be logged in to do that.' });
  }
};
