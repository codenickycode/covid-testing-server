const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb', extended: true }));

const uri = process.env.DB_URI;
mongoose.connect(
  uri,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  () => {
    console.log('Connected to database.');
  }
);

const clientRouter = require('./routes/client.js');
const providerRouter = require('./routes/provider.js');

app.use('/client', clientRouter);
app.use('/provider', providerRouter);

app.listen(port, () => {
  console.log('Server is running on port: ', port);
});
