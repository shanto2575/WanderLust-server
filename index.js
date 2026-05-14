const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const uri = process.env.MONGODB_URI
const port = process.env.PORT;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();

        const db = client.db('wanderlust')
        const destinationCollection = db.collection('destination')
        const bookingCollection=db.collection('booking')

        app.get('/destination', async (req, res) => {
            const result = await destinationCollection.find().toArray()
            res.send(result);
        })

        app.get('/destination/:id', async (req, res) => {
            const { id } = req.params;
            const result = await destinationCollection.findOne({ _id: new ObjectId(id) })
            res.send(result)
        })

        app.post('/destination', async (req, res) => {
            const destinationData = req.body;
            const result = await destinationCollection.insertOne(destinationData)
            // console.log(result)
            res.json(result)
        })

        app.patch('/destination/:id', async (req, res) => {
            const { id } = req.params;
            const UpdateData = req.body;
            // console.log(UpdateData,'updatae Data')

            const result = await destinationCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: UpdateData }
            )
            // console.log(result,'result')
            res.send(result)
        })

        app.delete('/destination/:id',async(req,res)=>{
            const {id}=req.params;
            const result= await destinationCollection.deleteOne({_id:new ObjectId(id)})
            res.send(result)
        })

        app.get('/booking/:userId',async(req,res)=>{
            const {userId}=req.params;
            const result=await bookingCollection.find({userId:userId}).toArray()
            res.json(result)
        })

        app.delete('/booking/:bookingId',async(req,res)=>{
            const {bookingId}=req.params;
            const result=await bookingCollection.deleteOne({_id:new ObjectId(bookingId)})
            res.json(result)
        })

        app.post('/booking',async(req,res)=>{
            const bookingData=req.body;
            const result=await bookingCollection.insertOne(bookingData)
            res.json(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello wanderLust server')
})
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})