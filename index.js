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
