const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwsxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("e_bike");
    const bikesCollection = database.collection("bikes");
    const moreBikeCollection = database.collection("moreBike");
    const purchaseCollection = database.collection("purchase");
    const usersCollection = database.collection("users");
    //code started

    //get bikes
    app.get("/bikes", async (req, res) => {
      const cursor = bikesCollection.find({});
      const bikes = await cursor.toArray();
      res.send(bikes);
    });

    //get  more bikes
    app.get("/moreBike", async (req, res) => {
      const cursor = moreBikeCollection.find({});
      const moreBikes = await cursor.toArray();
      res.send(moreBikes);
    });

    //get purchase data
    app.get("/purchaseItems", async (req, res) => {
      const cursor = purchaseCollection.find({});
      const purchase = await cursor.toArray();
      res.send(purchase);
    });

    //get purchase data filter by email
    app.get("/purchase", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = purchaseCollection.find(query);
      const purchase = await cursor.toArray();
      res.json(purchase);
    });

    //post purchase data
    app.post("/purchase", async (req, res) => {
      const purchase = req.body;
      const result = await purchaseCollection.insertOne(purchase);
      res.json(result);
    });

    //post users data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      // const requester = req.decodedEmail;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    //code ended
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello E-bike Server!");
});

app.listen(port, () => {
  console.log(`Listening at Port ${port}`);
});
