async function myDB(callback) {
  const URI = process.env.MONGO_URI; // Declare MONGO_URI in your .env file
  const client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await callback(client);
  } catch (e) {
    // Catch any errors
    console.error(e);
    throw new Error('Unable to Connect to Database');
  }
}

myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users');
  routes(app, myDataBase);
  auth(app, myDataBase);
}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});
