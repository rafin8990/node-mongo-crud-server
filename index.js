const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// dbNodeMongo
// cXcncXY2XbRLV68t

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://dbNodeMongo:cXcncXY2XbRLV68t@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');

        //  server to client 
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        //  server to mongodb 
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        });

        //  delete a data from server 

        app.delete('/users/:id', async (req, res) => {
            const _id = req.params.id;
            // console.log('trying to delete', _id)
            const query={_id: ObjectId(_id)} /* delete er  jonnno query  very very important */
            const  result=await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });



        // update korar jonno get method use kora hoy 
            // update a data 
        app.get('/users/:id', async (req, res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const result=await userCollection.findOne(query);
            res.send(result);

        })

        app.put('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const filter={_id: ObjectId(id)}
            const user=req.body;
            const option= {upsert:true};
            const updatedUser= {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            } 
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result);


        })





    }
    finally {

    }
}

run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('hello from crud server')
});

app.listen(port, () => {
    console.log(`listening to the port ${port}`)
});