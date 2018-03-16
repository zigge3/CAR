const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');

// connect to the database and load models
require('./models').connect(config.dbUri);

const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./static/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware


// routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


// start the server
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
});
