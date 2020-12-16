const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const auth = require('./auth.js');

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
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// connect to db
mongoose
  .connect(
    process.env.DB_URI,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
    () => {
      auth();
      console.log('Connected to database.');
    }
  )
  .catch((e) => console.log('Unabled to connect to database.'));

// routes
const clientRouter = require('./routes/client.js');
app.use('/client', clientRouter);
const providerRouter = require('./routes/provider.js');
app.use('/provider', providerRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is running on port: ', port);
});
