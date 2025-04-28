const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

const users = [
  {id:1, name: 'Sabana', email: 'sabana@gmail.com'},
  {id:2, name:'Sabila', email: 'sabila@gmail.com'}
]

// Environmental varialbles of firebase config file
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;

// MongoDB connection
const uri = `mongodb+srv://${db_username}:${db_password}@cluster1.4utyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    app.post('/adddestination', async (req, res) => {
      const destination = req.body;
      console.log(destination);
      const result = await client.db('tour-destination').collection('destination').insertOne(destination);
      res.send(result);
    })
    app.get('/destinations', async(req, res) =>{
      const query = {};
      const cursor = client.db('tour-destination').collection('destination').find(query);
      const destinations = await cursor.toArray();
      res.send(destinations);
    })
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) =>{
  res.json(users);
})

app.listen(port,() =>{
  console.log(`Server is running on http://localhost:${port}`);
})

