const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

//mongo server link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ffrq.mongodb.net/myFirstDatabase?
retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//run funtion
async function run() {
    try {

        //database
        await client.connect();
        const database = client.db("travelAgency");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");

        // server all user product
        app.get('/showusers', async(req, res) => {
            const curser = usersCollection.find({})
            const users = await curser.toArray()
            res.send(users)
        })

        // server specific user product
        app.get('/showusers/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.json(result)
        })

        // server product add
        app.post('/addusers', async(req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            res.json(result)
        })

        // home service button
        app.post('/buynow', async(req, res) => {
            const buy = req.body;
            const result = await ordersCollection.insertOne(buy)
            res.json(result)
        })

        // home service button user product show
        app.get('/myOrders', async(req, res) => {
            const curser = ordersCollection.find({})
            const users = await curser.toArray()
            res.send(users)
        })
        
        // home service button user product delete
        app.delete('/myOrders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result =  await ordersCollection.deleteOne(query)
            res.send(result)
        })

        // status update
        app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            ordersCollection
                .updateOne(filter, {
                $set: { status: updatedStatus },
                })
                .then((result) => {
                res.send(result);
                });
        });
        } finally {
        // await client.close();
        }
    }

    // run function call
    run().catch(console.dir);

// default 
app.get('/', (req, res) => {
    res.send('Travel Tour Agency');
})

//port
app.listen(port, () => {
    console.log('agency server running', port)
})