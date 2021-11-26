const express = require("express");
const cors = require("cors");
const {
	MongoClient
} = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("hello world!");
});

// MongoDB Database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfhzv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

async function run() {
	try {
		await client.connect();
		const packagesCollection = client.db("tourDatabase").collection("packages");
		const ordersCollection = client.db("tourDatabase").collection("orderpackages");

		// POST API
		app.post("/packages", async (req, res) => {
			const packages = req.body;
			const result = await packagesCollection.insertOne(packages);
			res.json(result);
		});

		// POST API
		app.post("/orderpackages", async (req, res) => {
			const orderPackages = req.body;
			const result = await ordersCollection.insertOne(orderPackages);
			res.json(result);
		});

		// GET API 
		app.get("/packages", async (req, res) => {
			const packages = await packagesCollection.find({}).toArray();
			res.send(packages);
		});

		// GET API 
		app.get("/allorderpackages", async (req, res) => {
			const packages = await ordersCollection.find({}).toArray();
			res.send(packages);
		});

		// GET API
		app.get('/myorderpackages', async (req, res) => {
			const email = req.query.email;
			console.log(email);
			const result = await ordersCollection.find({
				email: email
			}).toArray();
			res.send(result);
		});

		// DELETE API 
		app.delete("/myorderpackages/:id", async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: (id)
			};
			const result = await ordersCollection.deleteOne(query);
			res.json(result);
		});

	} finally {
		// await client.close();
	};
};
run().catch(console.dir);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});