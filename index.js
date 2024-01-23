const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qx5eerd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Collection
    const housesCollection = client.db("houseHunterDB").collection("houses");

    // Getting all houses data
    app.get("/houses", async (req, res) => {
      const result = await housesCollection.find().toArray();
      res.send(result);
    });

    // Getting room sizes data
    app.get("/houses/:roomSize", async (req, res) => {
      if (
        req.params.roomSize == "Small" ||
        req.params.roomSize == "Medium" ||
        req.params.roomSize == "Large"
      ) {
        const cursor = housesCollection.find({
          roomSize: req.params.roomSize,
        });
        const result = await cursor.toArray();
        return res.send(result);
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Hey Developer, you successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
