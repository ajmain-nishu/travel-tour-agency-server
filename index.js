const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ffrq.mongodb.net/myFirstDatabase?
retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travelAgency");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");
        app.get('/showusers', async(req, res) => {
            const curser = usersCollection.find({})
            const users = await curser.toArray()
            res.send(users)
        })
        app.get('/showusers/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.json(result)
        })
        app.post('/addusers', async(req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            res.json(result)
        })
        app.post('/buynow', async(req, res) => {
            const buy = req.body;
            const result = await ordersCollection.insertOne(buy)
            res.json(result)
        })
        app.get('/myOrders', async(req, res) => {
            const curser = ordersCollection.find({})
            const users = await curser.toArray()
            res.send(users)
        })
        
        app.delete('/myOrders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result =  await ordersCollection.deleteOne(query)
            res.send(result)
        })
        } finally {
        // await client.close();
        }
    }
    run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Travel Tour Agency');
})
app.listen(port, () => {
    console.log('agency server running', port)
})