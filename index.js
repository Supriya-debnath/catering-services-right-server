const express = require('express');
const app = express();
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crceb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri);

async function run(){
    try{
        await client.connect();
        // console.log('Database Connected Successfully');
        const database = client.db('catering_services')
        const serviceCollection = database.collection('services')
        const bookingCollection = database.collection('booking')

          // POST API
        app.post('/services', async (req, res) => {
        const Cservice = req.body;
        console.log('hitting the post api', Cservice);
  
        const result = await serviceCollection.insertOne(Cservice);
        console.log(result);
        res.json(result);
        });


        //Get services API
        app.get('/services', async(req,res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
          })
      
      
      
      
         //get api for a single data
         app.get('/services/:id', async(req, res) => {
           const carsor = req.params.id;
           const query = {_id: ObjectId(carsor)}
          const result = await serviceCollection.find(query).toArray();
          res.send(result[0]);
        })


           // POST booking
        app.post("/booking", async(req, res) => {
            const query = req.body;
            const result = await bookingCollection.insertOne(req.body);
            console.log(result);
            res.send(result);
        })


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res) => {
    res.send('catering server is running');
})

app.listen(port, () => {
    console.log('Server running at port', port);
})