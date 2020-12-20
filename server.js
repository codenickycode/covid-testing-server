const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const auth = require('./auth.js');
const logger = require('./logger.js');

// server settings
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: false, expires: 300000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// connect to db
mongoose
  .connect(process.env.DB_URI, {
    useUnifiedTopology: true, // fix deprecated mongo stuff
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    auth(); // passport authentication
    logger.info('Connected to database.');
  })
  .catch((e) => logger.error(e.message));

// routes
const commonRouter = require('./routes/common.js');
app.use('/common', commonRouter);
const providerRouter = require('./routes/provider.js');
app.use('/provider', providerRouter);

// start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on port: ${port}`);
});
