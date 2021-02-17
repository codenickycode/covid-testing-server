const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const auth = require('./auth.js');
const { logger, morganOptions } = require('./logger.js');
const morganBody = require('morgan-body');
const { limiter } = require('./rateLimiter');

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
  .catch((e) => logger.error('mongoose.connect => ' + e.message));

// server settings
const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    credentials: true,
    origin: true,
    allowHeaders: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => res.status(401).send('sorry'));

// morgan-body req and res logging
morganBody(app, morganOptions);

// rate limiting
app.set('trust proxy', 1);
app.use(limiter);

// routes
const commonRouter = require('./routes/common/common.js');
app.use('/common', commonRouter);
const providerRouter = require('./routes/provider/provider.js');
app.use('/provider', providerRouter);

// catch-all remaining errors
app.use((e, req, res, next) => {
  if (e) {
    logger.error(`Uncaught => ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
});

// start
const port = process.env.PORT || 8000;
app.listen(port, () => {
  logger.info(`Server is running on port: ${port}`);
});
