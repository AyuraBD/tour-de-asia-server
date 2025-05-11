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
    app.post('/register', async (req, res) =>{
      const user = req.body;
      const result = await client.db('tour-destination').collection('users').insertOne(user);
      res.send(result);
    })
    app.get('/destinations', async(req, res) =>{
      const query = {};
      const cursor = client.db('tour-destination').collection('destination').find(query);
      const destinations = await cursor.toArray();
      res.send(destinations);
    })
    app.get('/destination/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const destination = await client.db('tour-destination').collection('destination').findOne(query);
      res.send(destination);
    })
    app.get(`/profile/:email`, async(req, res) =>{
      const email = req.params.email;
      try{
        const user = await client.db('tour-destination').collection('users').findOne({email});
        console.log(user);
        if(!user){
          return res.status(404).send({error: 'User not found'});
        }
        res.send(user);
      } catch(err){
        console.error(err);
        res.status(500).send({error: 'Internal server error'});
      }
    })
    app.get(`/mylist/:email`, async(req, res) =>{
      const email = req.params.email;
      const query = {email};
      const cursor = client.db('tour-destination').collection('destination').find(query);
      const mylist = await cursor.toArray();
      res.send(mylist);
    })
    app.get(`/mylist/update/:id`, async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const cursor = await client.db('tour-destination').collection('destination').findOne(query);
      res.send(cursor);
    })
    app.patch('/mylist/update/:id', async (req, res) =>{
      const id = req.params.id;
      const updatedMyList = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set:{
          image: updatedMyList.image,
          tourist_spot: updatedMyList.tourist_spot,
          country_name: updatedMyList.country_name,
          location: updatedMyList.location,
          description: updatedMyList.description,
          cost: updatedMyList.cost,
          seasonality: updatedMyList.seasonality,
          time: updatedMyList.time,
          visitors: updatedMyList.visitors,
        } 
      }
      const result = await client.db('tour-destination').collection('destination').updateOne(filter, updateDoc, options);
      res.send(result);
    })
    app.delete('/mylist/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await client.db('tour-destination').collection('destination').deleteOne(query);
      res.send(result);
    })
    // Add country
    app.post('/addcountry', async(req, res) =>{
      const country = req.body;
      const result = await client.db('tour-destination').collection('country').insertOne(country);
      res.send(result);
    })
    app.get('/country', async(req, res) =>{
      const query = {};
      const cursor = client.db('tour-destination').collection('country').find(query);
      const countries = await cursor.toArray();
      res.send(countries);
    })
    app.get(`/country/:country_name`, async (req, res) =>{
      const country_name = req.params.country_name;
      const query = {country_name};
      const cursor = client.db('tour-destination').collection('destination').find(query);
      const country = await cursor.toArray();
      res.send(country);
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

