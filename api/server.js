const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);// this is called currying

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: "worcalyak", //default cookie 'sid' so hackers would know what library you're using. keep it changing
  secret: "keep it secret, keep it safe!",
  resave: false, //do we want to recreate a session even if it hasn't changed?? nah.
  saveUninitialized: true, //dynamically change for production!!!!! - GDPR compliance laws against seetting cookie automatically. (think pop up asking about cookies)
  cookie: {
    maxAge: 1000 * 30, //expires after 30 seconds   10*60*1000 = 10 minutes1*24*60*60*1000 = one day
    secure: false, //during dev send cookie only over https. when we go to production this will be true
    httpOnly: true, //cookie cannot be accessed from client side from javascrip, always set to true 
  }, 
  store: new KnexSessionStore({
    knex: require('../database/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createTable: true,
    clearInterval: 1000 * 60 * 60, //tells the library to check the database and clear out all the old sessions to keep the table tight and small
  }),
};

// global middlewares
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
